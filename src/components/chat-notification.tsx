import IconWarning from '@/assets/images/warning.svg'
import { ChatError, ErrorCode, ChatMessageModel } from '@/lib/bots/bing/types'
import { ExternalLink } from './external-link'
import { BingReturnType } from '@/lib/hooks/use-bing'
import { SVG } from './ui/svg'

export interface ChatNotificationProps extends Pick<BingReturnType, 'bot'> {
  message?: ChatMessageModel
}

function getAction(error: ChatError, reset: () => void) {
  if (error.code === ErrorCode.THROTTLE_LIMIT) {
    reset()
    return (
      <div>
        Количество запросов слишком быстрое и ограничено. Повторите попытку позже...
      </div>
    )
  }
  if (error.code === ErrorCode.BING_IP_FORBIDDEN) {
    return (
      <ExternalLink href="https://github.com/weaigc/bingo/issues">
        Ваш сервер или прокси-сервер заблокирован. Смените сервер или используйте прокси-сервер, чтобы повторить попытку.
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.BING_TRY_LATER) {
    return (
      <a href={`#dialog="reset"`}>
        Не удалось выполнить запрос. Повторите попытку вручную.
      </a>
    )
  }
  if (error.code === ErrorCode.BING_FORBIDDEN) {
    return (
      <ExternalLink href="https://bing.com/new">
        Ваш аккаунт занесен в черный список. Попробуйте сменить аккаунт и подать заявку на разблокировку.
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return (
      <div>
        Текущая тема приостановлена, пожалуйста, нажмите
        <a href={`#dialog="reset"`}>Начать заново</a>
        чтобы начать новый разговор
      </div>
    )
  }
  if (error.code === ErrorCode.BING_CAPTCHA) {
    return (
      <ExternalLink href="https://www.bing.com/turing/captcha/challenge">
        Нажмите, чтобы пройти CAPTCHA
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    reset()
    return (
      <a href={`#dialog="settings"`}>Информация пользователя не была получена или информация пользователя недействительна, нажмите здесь, чтобы сбросить</a>
    )
  }
  if (error.code === ErrorCode.BING_IMAGE_UNAUTHORIZED) {
    reset()
    return (
      <a href={`#dialog="settings"`}>Для рисования требуется информация пользователя. Система не получила достоверную информацию о пользователе. Нажмите здесь, чтобы настроить</a>
    )
  }
  return error.message
}

export function ChatNotification({ message, bot }: ChatNotificationProps) {
  if (!message?.error) return

  return (
    <div
      className="notification-container"
    >
      <div className="bottom-notifications">
        <div className="inline-type with-decorative-line">
          <div className="text-container mt-1">
            <div className="title inline-flex items-start">
              <SVG alt="error" src={IconWarning} width={20} className="mr-1 mt-1" />
              {getAction(message.error, () => bot.resetConversation())}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
