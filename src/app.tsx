import { ChangeEvent,useState } from 'react'
import logo from './assets/Logo.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note{
  id:string,
  date: Date,
  content: string
}
export function App() {

  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('notes')
    if(storedNotes){
      return JSON.parse(storedNotes)
    }
    return []
  })

  function onNoteCreated(content: string){

    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote , ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string){
    const newNotes = notes.filter(note => note.id !== id)
    setNotes(newNotes)
    localStorage.setItem('notes', JSON.stringify(newNotes))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    setSearch(event.target.value)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'>
      <img src={logo} alt='Nlw Expert' />

      <form className='w-full'>
        <input
          type='text'
          placeholder='Busque suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
          value={search}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        {
          filteredNotes.map(note => {
            return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
}         )
        }
      </div>
    </div>
  )
}

export default App
