import './App.css'
import { Box, List, ThemeIcon } from '@mantine/core'
import useSWR from 'swr';
import AddTodo from './components/AddTodo';
import { CheckCircleFillIcon } from '@primer/octicons-react';

export const ENDPOINT = "http://localhost:4000";

// creating POJO or interface for the API response
export interface TodoSkeleton {
  id: number,
  title: string,
  body: string,
  done: boolean,
}

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`)
    .then((r) => r.json());

//function to call the backend APIs and show the response on the UI. The return statement inside the function
//provides a box to display the todo inside it 
function App() {

  const { data, mutate } = useSWR<TodoSkeleton[]>('api/todos', fetcher)


  async function markTodoAsDone(todoID: number) {
    const updated =
      await fetch(`${ENDPOINT}/api/markTodoAsDone/${todoID}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: "",
      }).then((response) => response.json());

    mutate(updated)
  }

  return (
    <Box>
      <div style={{
        padding: "2rem",
        textAlign: "left",
        border: "dark"
      }}>
        <List spacing="xs" size="sm" mb={12} >
          <div style={{
            padding: "2rem",
            textAlign: "left",
            border: "1px solid black",
            borderRadius: "10px"
          }}>
            {data?.map((todo) => {
              return (
                <List.Item
                  key={`todo_list_${todo.id}`}
                  onClick={() => markTodoAsDone(todo.id)}
                  icon={
                    todo.done ?
                      (
                        <ThemeIcon color="teal" size={24} radius="xl">
                          <CheckCircleFillIcon size={20} />
                        </ThemeIcon>
                      ) : (
                        <ThemeIcon color="gray" size={24} radius="xl">
                          <CheckCircleFillIcon size={20} />
                        </ThemeIcon>
                      )
                  }

                >{todo.title}</List.Item>
              );
            })}
          </div>
        </List>
      </div>
      <AddTodo mutate={mutate} />
    </Box>
  )
}


export default App
