import { useCallback } from 'react'
import { useAtom } from 'jotai'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import Prompts from './form'
import { hashAtom } from '@/state'

interface PromptDialogProps {
  insertPrompt(text: string): void
}
export function PromptsManage (props: PromptDialogProps) {
  const [loc, setLoc] = useAtom(hashAtom)
  const insertPrompt = useCallback((text: string) => {
    setLoc('')
    props?.insertPrompt(text)
  }, [loc, setLoc])
  if (loc === 'prompts') {
    return (
      <Dialog open modal onOpenChange={() => setLoc('')}>
        <DialogContent className="flex flex-col max-h-full">
          <DialogHeader>
            <DialogTitle>Руководство слова-подсказки</DialogTitle>
          </DialogHeader>
          <Prompts insertPrompt={insertPrompt} />
        </DialogContent>
      </Dialog>
    )
  }
  return null
}
