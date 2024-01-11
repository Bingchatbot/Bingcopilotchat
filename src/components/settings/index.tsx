import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { toast } from 'react-hot-toast'
import { Switch } from '@headlessui/react'
import { hashAtom, historyAtom, isImageOnly } from '@/state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ChunkKeys, parseCookies, extraCurlFromCookie, parseHeadersFromCurl, encodeHeadersToCookie, setCookie, resetCookies } from '@/lib/utils'
import { ExternalLink } from '../external-link'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { VoiceSetting } from './voice'
import { AdvancedSetting } from './advanced'

export function Settings() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [loc, setLoc] = useAtom(hashAtom)
  const [curlValue, setCurlValue] = useState(extraCurlFromCookie(parseCookies(document.cookie, ChunkKeys)))
  const [imageOnly, setImageOnly] = useState(isImageOnly)
  const [enabledHistory, setHistory] = useAtom(historyAtom)

  useEffect(() => {
    if (isCopied) {
      toast.success('Копирование выполнено успешно')
    }
  }, [isCopied])

  const handleSwitchImageOnly = useCallback((checked: boolean) => {
    let headerValue = curlValue
    if (headerValue) {
      try {
        headerValue = atob(headerValue)
      } catch (e) { }
      if (!/^\s*curl ['"]https:\/\/www\.bing\.com\/turing\/captcha\/challenge['"]/.test(headerValue)) {
        toast.error('Неправильный формат информации о пользователе')
        return
      }
      setImageOnly(checked)
    } else {
      setImageOnly(checked)
    }
    if (checked) {
      setHistory(false)
    }
  }, [curlValue])

  if (loc === 'settings') {
    return (
      <Dialog open onOpenChange={() => setLoc('')} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Установите информацию о пользователе</DialogTitle>
            <DialogDescription>
              Пожалуйста, используйте браузер Edge
              <ExternalLink
                href="https://www.bing.com"
              >
                Откройте и войдите в Bing
              </ExternalLink>
              , а затем откройте
              <ExternalLink href="https://www.bing.com/turing/captcha/challenge">Интерфейс вызова</ExternalLink>
              Щелкните правой кнопкой мыши на Проверить. Откройте инструменты разработчика, найдите в сети интерфейс Challenge, щелкните его правой кнопкой мыши и скопируйте, скопируйте его как cURL (bash), вставьте сюда и сохраните.
              <div className="h-2" />
              Графические и текстовые примеры:
              <ExternalLink href="https://github.com/weaigc/bingo#如何获取-bing_header">如何获取 BING_HEADER</ExternalLink>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">

          </div>
          <Input
            value={curlValue}
            placeholder="Заполните здесь информацию о пользователе, формат: curl 'https://www.bing.com/turing/captcha/challenge' ..."
            onChange={e => {
              setCurlValue(e.target.value)
            }}
          />
          <div className="flex gap-2">
            <Switch
              checked={imageOnly}
              className={`${imageOnly ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked: boolean) => handleSwitchImageOnly(checked)}
            >
              <span
                className={`${imageOnly ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            Идентификационная информация используется только для рисования (рекомендуется включить)
          </div>

          <div className="flex gap-2">
            <Switch
              checked={enabledHistory}
              className={`${enabledHistory ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked: boolean) => setHistory(checked)}
            >
              <span
                className={`${enabledHistory ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            Включить историю
          </div>

          <Button variant="ghost" className="bg-[#F5F5F5] hover:bg-[#F2F2F2]" onClick={() => copyToClipboard(btoa(curlValue))}>
            Преобразовать в BING_HEADER и скопировать
          </Button>

          <Button variant="ghost" className="bg-[#F5F5F5] hover:bg-[#F2F2F2]" onClick={() => copyToClipboard(parseHeadersFromCurl(curlValue).cookie)}>
            Получите BING_COOKIE и скопируйте.
          </Button>

          <DialogFooter className="items-center">
            <Button
              variant="secondary"
              className="bg-[#c7f3ff] hover:bg-[#fdc7ff]"
              onClick={() => {
                let headerValue = curlValue
                if (headerValue) {
                  try {
                    headerValue = atob(headerValue)
                  } catch (e) { }
                  if (!/^\s*curl ['"]https:\/\/(www|cn)\.bing\.com\/turing\/captcha\/challenge['"]/.test(headerValue)) {
                    toast.error('Неправильный формат информации о пользователе')
                    return
                  }
                  encodeHeadersToCookie(headerValue).forEach(cookie => setCookie(cookie))
                } else {
                  resetCookies()
                }
                setCookie('IMAGE_ONLY', RegExp.$1 === 'cn' || imageOnly || !headerValue ? '1' : '0')

                toast.success('Сохранение выполнено успешно')
                setLoc('')
                setTimeout(() => {
                  location.href = './'
                }, 2000)
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  } else if (['voice', 'advanced'].includes(loc)) {
    return (
      <Dialog open onOpenChange={() => setLoc('')} modal>
        <DialogContent>
          { loc === 'voice' ? <VoiceSetting /> : <AdvancedSetting /> }
          <DialogFooter className="items-center">
            <Button
              variant="primary"
              onClick={() => {
                toast.success('Сохранение выполнено успешно')
                setLoc('')
                setTimeout(() => {
                  location.href = './'
                }, 2000)
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return null
}
