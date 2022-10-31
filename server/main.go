package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type TodoSkeleton struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

func main() {
	fmt.Print("Hello world!!!")

	//instantiating the server
	app := fiber.New()

	//Allow CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	//declaring the todo list
	todos := []TodoSkeleton{}

	//---------------------Creating different end points---------------------
	app.Get("/healthCheck", func(c *fiber.Ctx) error {
		return c.SendString("Server is working ffine")
	})

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	app.Post("/api/addTodos", func(c *fiber.Ctx) error {
		todo := &TodoSkeleton{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		todo.ID = len(todos) + 1

		todos = append(todos, *todo)

		return c.JSON(todos)
	})

	app.Patch("/api/markTodoAsDone/:id", func(c *fiber.Ctx) error {
		todoIdToPatch, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}

		//iterate through todos and if the id matches todo.ID, mark the todo.done as true
		for i, t := range todos {
			if t.ID == todoIdToPatch {
				todos[i].Done = true
			}
		}

		return c.JSON(todos)
	})
	log.Fatal(app.Listen(":4000"))
}
