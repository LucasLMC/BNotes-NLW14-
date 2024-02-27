import * as Dialog from "@radix-ui/react-dialog"
import { ptBR } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'
import { X } from 'lucide-react'
interface NodeCardProps {
    note: {
        id: string,
        date: Date,
        content: string
    }

    onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NodeCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className='
            rounded-md text-left flex flex-col
            bg-slate-800 p-5 gap-3
            overflow-hidden relative outline-none
            hover:ring-2 hover:ring-slate-600
            focus:ring-2 focus:ring-lime-600
            '>
                <span className='text-sm font-medium text-slate-300'>
                    {formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}
                </span>

                <p className='text-sm leading-6 text-slate-400'>
                    {note.content}
                </p>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-800 pointer-events-none' />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50">
                    <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
                        <Dialog.Close className="absolute right-5 top-5 p-1.5 text-slate-400 ">
                            <X className="size-5"/>
                        </Dialog.Close>

                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className='text-sm font-medium text-slate-300'>
                                {formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}
                            </span>

                            <p className='text-sm leading-6 text-slate-400'>
                                {note.content}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onNoteDeleted(note.id)}
                            className="w-full py-4 text-center text-sm outline-none bg-slate-800 text-slate-300 font-medium group"
                        >
                            Deseja <span className="text-red-500 group-hover:underline">apagar esta nota?</span>
                        </button>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
