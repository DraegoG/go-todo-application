import { useState } from "react";
import { useForm } from '@mantine/form';
import { Button, Modal, Group, TextInput, Textarea } from "@mantine/core";
import { ENDPOINT, TodoSkeleton } from "../App";
import { KeyedMutator } from "swr";
// import { KeyedMutator } from "swr";


// the below function is responsible for creating the form int he UI and doing a POST call to the backend to add a todo 
function AddTodo({ mutate }: { mutate: KeyedMutator<TodoSkeleton[]> }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        initialValues: {
            title: "",
            body: "",
        }
    });

    async function createTodo(todo: { title: string, body: string }) {
        const updated =
            await fetch(`${ENDPOINT}/api/addTodos`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo),
            }).then((response) => response.json());

        mutate(updated)
        form.reset();
        setOpen(false);
    }

    return (
        <>
            {/* this is for creating the pop up */}
            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Create a TODO"
            >
                <form onSubmit={form.onSubmit(createTodo)}>
                    <TextInput
                        required
                        mb={12}
                        label="Todo"
                        placeholder="What do you want to do?"
                        {...form.getInputProps("title")} // -> used to define the name of the variable holding the value of the TextInput box
                    />
                    <Textarea
                        required
                        mb={12}
                        label="Body"
                        placeholder="Description"
                        {...form.getInputProps("body")} // -> used to define the name of the variable holding the value of the TextInput box
                    />
                    <Button type="submit">Create TODO</Button>
                </form>
            </Modal>

            {/* this is for creating and placing the button */}
            <Group position="center">
                <Button fullWidth mb={12} onClick={() => setOpen(true)}>
                    Add a todo
                </Button>
            </Group>
        </>
    );
}


export default AddTodo