import { useState, useEffect, useRef, forwardRef } from 'react';
import { useSession, signOut } from "next-auth/react";
import { getSession } from 'next-auth/react'

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

export default function Feed () {
    const { data: session } = useSession()
    const user_id = session?.user?.email

    const [showProfileCard, setShowProfileCard] = useState(false);
    const profileCardRef = useRef(null);

    const handleClickOutside = (event) => {
        if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
            setShowProfileCard(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const [inputValue, setInputValue] = useState('');

    const [list, setList] = useState([]);
    const endOfNotes = useRef(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (inputValue === '') {
            return;
        }

        const newItem = {
            uuid: uuidv4(),
            date: new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            note: inputValue,
            user_id: user_id,
        };

        setList(prevList => [...prevList, newItem]);

        await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        setInputValue('');
    };

    const notes_list = list.map(note => <NoteCard key={note.uuid} note_information={note}/> )

    function ProfilePicButton({onClick}) {
        return (
            <button
                onClick={onClick}
                style={{ position: "fixed", bottom: "30px", left: "30px", padding: "0", borderRadius: "50%", width: "50px", height: "50px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <img src="/profile_pic.png" alt="A profile picture" style={{ borderRadius: "50%", width: "50px", height: "50px" }} />
            </button>
        );
    }

    const ProfileCard = forwardRef((props, ref) => {
        return (
            <div
                ref={ref}
                style={{
                    position: "fixed",
                    bottom: "70px",
                    left: "30px",
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "15px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <img src="/profile_pic.png" alt="A profile picture" style={{ borderRadius: "50%", width: "50px", height: "50px" }} />
                <p>{user_id}</p>
                <button style={{ width: "100%", margin: "5px 0" }}>Settings</button>
                <button style={{ width: "100%", margin: "5px 0" }} onClick={() => signOut()}>Log out</button>
            </div>
        );
    });

    // Load notes on initial render
    useEffect(() => {
        fetch('/api/get-notes')
            .then(response => response.json())
            .then(notes => setList(notes))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        endOfNotes.current?.scrollIntoView({ behavior: "smooth" });
    }, [list]);

    return (
        <>
            <div id="feed">{notes_list}</div>
            <div>
                <form id="input" onSubmit={handleSubmit}>
                    <input type="text" value={inputValue} onChange={handleChange}/>
                    <button type="submit" id="post">Post Note</button>
                </form>
            </div>
            <div ref={endOfNotes} />
            <ProfilePicButton onClick={() => setShowProfileCard(true)} />
            {showProfileCard &&
                <ProfileCard
                    ref={profileCardRef}
                />}
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/signin",
            },
        };
    }

    return {
        props: {},
    };
}
