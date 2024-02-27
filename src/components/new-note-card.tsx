import * as Dialog from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
import { FormEvent, ChangeEvent, useState } from "react"
import { toast } from "sonner"

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {

    const [shouldShowOnboard, setShouldShowOnboard] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor() {
        setShouldShowOnboard(false)
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboard(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault()

        if(content === '') {
            return
        }

        onNoteCreated(content)

        setShouldShowOnboard(true)
        setContent('')

        toast.success('Nota salva com sucesso!')
    }

    function handleStartRecording() {
        setIsRecording(true)
        setShouldShowOnboard(false)

        const isSpeechRecognitionApiAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if(!isSpeechRecognitionApiAvailable) {
            toast.error('Infelizmente seu navegador nao suporta gravacão de audio. Tente no Chrome')
            return
        }

        const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition

        const speechRecognition = new SpeechRecognitionApi()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const content = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')
            setContent(content)
        }

        speechRecognition.onerror = (event) => {
            console.log("Error",event)
        }

        speechRecognition.start()

        toast.error('Funcionalidade em desenvolvimento')
    }

    function handleStopRecording() {
        setIsRecording(false)
        speechRecognition?.stop()
        toast.success('A gravação foi concluída com sucesso')
    }

    return (
        <Dialog.Root>

            <Dialog.Trigger className='rounded-md flex flex-col  bg-slate-700 text-left p-5 space-y-3             hover:ring-2 hover:ring-slate-600
            focus:ring-2 focus:ring-lime-600'>
                <span className='text-sm font-medium text-slate-200'>
                    Adicionar Nota
                </span>

                <p className='text-sm leading-6 text-slate-400'>
                    Grava uma nota em audio que sera convertida automaticamente</p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50">
                    <Dialog.Content className="fixed overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2
                    md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
                        <Dialog.Close className="absolute right-5 top-5 p-1.5 text-slate-400 ">
                            <X className="size-5" />
                        </Dialog.Close>
                        <form className="flex-1 flex flex-col">
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <span className='text-sm font-medium text-slate-300'>
                                    Adicionar Nota
                                </span>
                                {
                                    shouldShowOnboard ?
                                        (
                                            <p className='text-sm leading-6 text-slate-400'>
                                                Comece <button
                                                    type="button"
                                                    className="font-medium text-lime-400 hover:underline"
                                                    onClick={handleStartRecording}
                                                >gravando uma nota</button> em audio ou se preferir <button className="font-medium text-lime-400 hover:underline" onClick={handleStartEditor}>use apenas texto</button>
                                            </p>
                                        ) : (
                                            <textarea
                                                autoFocus
                                                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                                onChange={handleContentChange}
                                                value={content}
                                            />
                                        )
                                }
                            </div>
                            {
                                isRecording ?
                                    (
                                        <button
                                            type="button"
                                            className="w-full flex items-center justify-center  gap-2 py-4 text-center text-sm outline-none bg-slate-900 text-slate-300 font-medium hover:text-slate-100"
                                            onClick={handleStopRecording}
                                        >
                                            <div className="size-3 rounded-full bg-red-500 animate-ping"/>
                                            Gravando ! (click para interromper)
                                        </button>
                                    ) :
                                    (
                                        <button
                                            type="button"
                                            className="w-full py-4 text-center text-sm outline-none bg-lime-400 text-lime-950 font-medium hover:bg-lime-500"
                                            onClick={handleSaveNote}
                                        >
                                            Salvar Nota
                                        </button>
                                    )
                            }
                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
