import { useEffect } from "react"
import { toast } from "react-hot-toast"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { SVG } from "./ui/svg"
import CopyIcon from '@/assets/images/copy.svg'


interface ChatFeedbackProps {
  text: string
}
export function ChatFeedback({ text }: ChatFeedbackProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  useEffect(() => {
    if (isCopied) {
      toast.success('Копирование выполнено успешно')
    }
  }, [isCopied])
  return text ? (
    <div className="chat-feedback">
      <div className="chat-feedback-container">
        <button type="button" role="button" aria-label="Копировать" title="Копировать" onClick={() => copyToClipboard(text)}>
          <SVG src={CopyIcon} width={24} />
          <div>Копировать</div>
        </button>
      </div>
    </div>
  ) : null
}
