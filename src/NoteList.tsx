import { useMemo, useState } from "react";

import ReactSelect from "react-select";
import { Link } from "react-router-dom";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Note, Tag } from "./App";
import NoteCard from "./NoteCard";

type NoteListProps = {
    availableTags: Tag[]
    notes: Note[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
    availableTags: Tag[]
    handleClose: () => void
    show: boolean
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

export default function NoteList({ availableTags, notes, onDeleteTag, onUpdateTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState<string>("")
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState<boolean>(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === "" || note.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()))
                && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes, availableTags])
    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button variant="outline-secondary" onClick={() => setEditTagsModalIsOpen(true)}>
                            Edit Tags
                        </Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                isMulti
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(
                                        tags.map(tag => {
                                            return { label: tag.label, id: tag.value }
                                        }))
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal show={editTagsModalIsOpen} handleClose={() => setEditTagsModalIsOpen(false)} availableTags={availableTags} onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag} />
        </>
    )
}

function EditTagsModal({ availableTags, handleClose, show, onDeleteTag, onUpdateTag }: EditTagsModalProps) {
    return (<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                                <Form.Control onChange={e => onUpdateTag(tag.id, e.target.value)} type="text" value={tag.label} />
                            </Col>
                            <Col xs="auto">
                                <Button onClick={() => onDeleteTag(tag.id)} variant="outline-danger">
                                    &times;
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>)
}
