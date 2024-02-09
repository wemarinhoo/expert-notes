import * as Dialog from '@radix-ui/react-dialog'
import {formatDistanceToNow} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import { X } from 'lucide-react'

interface NoteCardProps{
  note: {
    id: string
    date: Date
    content: String
  }
  OnNoteDeleted: (id:string) => void
}

export function NoteCard({note, OnNoteDeleted}: NoteCardProps){
  return(
    <Dialog.Root>
    <Dialog.Trigger className="rounded-md bg-slate-800 p-5 flex flex-col gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 text-left outline-none focus-visible:ring-2 focus-visible:ring-lime-400 transition-shadow">
          <span className='text-small text-slate-300 font-medium'>{formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}</span>
          <p className='text-small leading-6 text-slate-400'>{note.content}</p>

          <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'></div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/60'></Dialog.Overlay>
          <Dialog.Content className='fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 inset-0 md:inset-auto md:rounded-md flex flex-col outline-none overflow-hidden'>
            
            <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 transition-all rounded-bl-md outline-none focus-visible:ring-2 focus-visible:ring-lime-400'>
              <X className='size-5'/>
            </Dialog.Close>
            
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-small text-slate-300 font-medium'>{formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}</span>
              <p className='text-small leading-6 text-slate-400'>{note.content}</p>
            </div>

            <button type="button" className='w-full bg-red-500 py-4 text-center text-sm text-lime-950 cursor-pointer font-bold hover:bg-red-600 outline-none focus-visible:underline ' onClick={() => OnNoteDeleted(note.id)} >Deseja apagar essa nota?</button>
          </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}