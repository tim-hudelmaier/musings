import { useState } from 'react';

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function NoteCard ( {note_information} ) {
    return (
        <div className="note">
            <div className="note-metadata">
                <p className="date">{note_information.date}</p>
            </div>
            <div className="note-body>">
                <p className="note-text">{note_information.note}</p>
            </div>
        </div>
    )
}

function Feed () {

    const [inputValue, setInputValue] = React.useState('');

    const [list, setList] = React.useState(() => {
        const savedNotes = localStorage.getItem('notes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const newItem = {
            uuid: uuidv4(),
            date: new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            note: inputValue
        };

        setList(prevList => {
            const newList = [...prevList, newItem];
            localStorage.setItem('notes', JSON.stringify(newList));
            return newList;
        });
        setInputValue('');
    }

    const notes_list = list.map(note => <NoteCard key={note.uuid} note_information={note}/> )

    return (
        <>
            <div id="feed">{notes_list}</div>
            <div id="input">
                <input type="text" value={inputValue} onChange={handleChange}/>
                <button onClick={handleSubmit} id="post">Post Note</button>
            </div>
        </>
    )
}

function App () {
    return (
        <div>
            <Feed />
        </div>
    )
}