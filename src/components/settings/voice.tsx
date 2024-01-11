import { useAtom } from 'jotai'
import { Switch } from '@headlessui/react'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { voiceAtom } from '@/state'

export function VoiceSetting() {
  const [enableTTS, setEnableTTS] = useAtom(voiceAtom)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Настройки голоса</DialogTitle>
        <DialogDescription>
           В настоящее время поддерживаются только браузеры PC Edge и Chrome.
        </DialogDescription>
      </DialogHeader>

      <div className="flex gap-2">
        Включить голосовые ответы
        <Switch
          checked={enableTTS}
          className={`${enableTTS ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
          onChange={(checked: boolean) => setEnableTTS(checked)}
        >
          <span
            className={`${enableTTS ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
    </>
  )
}
