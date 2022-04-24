import { PlusIcon } from '@heroicons/react/outline'
import { NotesDocument, NotesQuery, useNotesQuery } from 'gql-schema'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { Button } from 'ui'
import NoteList from '../components/NoteList'
import {
  createPropsWithInitialApolloState,
  initializeApollo,
} from '../libs/apollo'

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo()
  // Prefetch the data from the server side
  await apolloClient.query({ query: NotesDocument })

  return {
    props: createPropsWithInitialApolloState(apolloClient),
  }
}

export default function Index() {
  const { loading, data } = useNotesQuery()
  const [activeNoteId, setActiveNoteId] = useState<
    NotesQuery['notes'][number]['id'] | undefined
  >(data?.notes[0]?.id)

  useEffect(() => {
    // Initialize the activeNoteId
    // when it was loading before and the activeNoteId hasn't been initialized
    if (!loading && !activeNoteId && data?.notes[0]?.id) {
      setActiveNoteId(data.notes[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoteId, data?.notes[0]?.id, loading])

  return (
    <div>
      <main className="mx-auto max-w-5xl px-4 pt-20 text-neutral-600">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-neutral-700 sm:text-5xl lg:text-6xl">
            Notes
          </h1>
        </div>
        <section className="grid grid-cols-4 divide-x overflow-hidden rounded-lg border border-neutral-300">
          <div id="note-list" className="bg-neutral-200 py-4">
            <div className="mb-2 flex items-center justify-between py-2 px-6">
              <h2 className="text-sm font-bold uppercase text-neutral-400">
                Your notes
              </h2>
              <button
                title="Add a new note"
                className="h-5 w-5 rounded border border-neutral-400 hover:bg-neutral-100"
              >
                <PlusIcon className="mx-auto h-3 w-3" />
              </button>
            </div>
            <NoteList
              notes={data?.notes}
              isLoading={loading}
              activeNoteId={activeNoteId}
              onActiveNoteChange={setActiveNoteId}
            />
          </div>
          <div
            id="note-content"
            className="col-span-full col-start-2 bg-[#FFFEFC] py-4 px-6 pb-4"
          >
            <div id="status-bar" className="mb-4 flex justify-between text-xs">
              <div></div>
              <div id="status-right" className="flex justify-end">
                <span className="rounded-lg bg-green-100 py-1 px-2 text-green-600">
                  Saved
                </span>
              </div>
            </div>
            <div className="mx-auto">
              <input
                type="text"
                id="note-title"
                className="mb-4 w-full text-lg font-bold focus-visible:outline-0"
                placeholder="Title"
              />
              <ReactTextareaAutosize
                id="content"
                className="w-full"
                minRows={6}
                placeholder="Type your note here..."
              />
            </div>
          </div>
        </section>
      </main>
      <div className="hidden">
        <Button />
      </div>
    </div>
  )
}
