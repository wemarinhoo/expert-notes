import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { AddNoteCard } from './components/add-note-card'
import { NoteCard } from './components/note-card'
import { Search } from 'lucide-react'

interface iNote {
  id: string,
  date: Date,
  content: string
}
export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes]  = useState<iNote[]>(() => {
    
    const notesOnStorage = localStorage.getItem('notes')

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    return []
  }
  )

  function HandleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search != ''
  ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  : notes

  function OnNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID,
      date: new Date(),
      content,
    }

    const listArrays = [newNote, ...notes]

    setNotes(listArrays)

    localStorage.setItem('notes', JSON.stringify(listArrays))

  }

  function OnNoteDeleted(id: string){
    const listArrays = notes.filter(note => {return note.id != note.id})

    setNotes(listArrays)
    localStorage.setItem('notes', JSON.stringify(listArrays))
  }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt='nlw expert logo'></img>

    <form className='w-full flex flex-col gap-4'>
        <input type="text" placeholder='Busque suas notas...' className="w-full text-3xl font-semibold bg-transparent tracking-tight placeholder:text-slate-500 outline-none peer"
        onChange={HandleSearch}/>
        <div className='h-px bg-slate-400 peer-focus:bg-lime-400 peer-focus-visible:bg-lime-400 transition-colors'/> 
    </form>

      <div className='grid  grid-cols:1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] '>
        
      <AddNoteCard OnNoteCreated={OnNoteCreated}/>

      {filteredNotes.map(note => {
        return <NoteCard key={note.id} note={note} OnNoteDeleted={OnNoteDeleted}/>
        }
      )}
      </div>
    </div>
)
}

export default App