import * as Dialog from '@radix-ui/react-dialog'
import {X} from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import {toast} from 'sonner'

interface newNoteCardProps {
  OnNoteCreated: (content: string) => void
}
export function AddNoteCard({OnNoteCreated}: newNoteCardProps){

  const [isRecording, setIsRecording] = useState(false)
  const [shouldShownOnBoarding, setShouldShownOnBoarding] = useState(true)
  const [content, setContent] = useState('')

  let speechRecognition: SpeechRecognition | null = null
  function HandleStartRecording(){

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvailable){
      alert("Infelizmente, seu navegador não tem suporte a funcionalidade de gravação")
      return
    }

    setIsRecording(true)
    setShouldShownOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => { 
        return text.concat(result[0].transcript) }, '')

        setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function HandleStopRecording(){
    setIsRecording(false)

    if(speechRecognition != null){
      speechRecognition.stop()
    }
  }

  function handleStartEditor(){
    setShouldShownOnBoarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if(event.target.value === ''){
      setShouldShownOnBoarding(true)
    }
  }

  function handleSaveNote(event: FormEvent){
    event.preventDefault()

    if(content === ''){
      return 
    } else {
      OnNoteCreated(content)

      setContent('')
      setShouldShownOnBoarding(true)
      toast.success('Nota Criada Com Sucesso')
    }
    
  }

  return(
    <Dialog.Root>
    <Dialog.Trigger className="rounded-md bg-slate-800 p-5 gap-3 overflow-hidden hover:ring-2 hover:ring-slate-600 text-left flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-lime-400 transition-shadow">
          <span className='text-small text-slate-200 font-medium'>Adicionar nota</span>
          <p className='text-small leading-6 text-slate-400'>Grave uma nota em áudio que será convertido em texto</p>
        </Dialog.Trigger>

    <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/60'></Dialog.Overlay>
          <Dialog.Content className='fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full inset-0 md:inset-auto md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden'>
            
            <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 transition-all rounded-bl-md outline-none focus-visible:ring-2 focus-visible:ring-lime-400 z-10'>
              <X className='size-5'/>
            </Dialog.Close>
            
            <form className='flex-1 flex flex-col relative'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-small text-slate-300 font-medium'>Adicionar nota</span>

              {shouldShownOnBoarding ? (<p className='text-small leading-6 text-slate-400'>Comece <button type="button" onClick={HandleStartRecording} className='text-lime-400 font-bold outline-none hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type="button" className='text-lime-400 font-bold outline-none hover:underline' onClick={handleStartEditor}> utilize apenas texto</button></p>) :(
                <div className='h-full flex flex-col w-full'>
                <textarea autoFocus placeholder="..." className='text-sm leading-6 bg-transparent resize-none h-[80%] outline-none focus-visible:ring-2 focus-visible:ring-slate-400 p-2 rounded-md' onChange={handleContentChange} value={content}></textarea>

                <button type="button" onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-900 cursor-pointer hover:bg-lime-500 font-bold focus-visible:underline outline-none bottom-0 left-0 absolute '>Salvar nota</button>
                </div>
              )}
            </div>

            {isRecording ? (
              <button onClick={HandleStopRecording} type="button" className='w-full bg-lime-400 py-4 text-center text-sm text-lime-900 cursor-pointer hover:bg-lime-500 font-bold focus-visible:underline outline-none bottom-0 left-0 absolute flex items-center justify-center gap-2'>
                <div className='size-3 rounded-full bg-lime-950 animate-pulse'/>
                Gravando! clique para interromper
              </button>
            ) : (
              <button type="button" onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-900 cursor-pointer hover:bg-lime-500 font-bold focus-visible:underline outline-none bottom-0 left-0 absolute '>Salvar nota</button>
            )}
              
            </form>

          </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}