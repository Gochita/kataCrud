package com.kataCrud.kataCrud;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TodoController {



    @Autowired
    private TodoService service;

    @GetMapping(value = "api/todos")
    public Iterable<Todo> list() {

        return service.list();

    }
    //se escribe el comentario del nombre to do por separado ya que lo toma como un to_do real jeje
    //mapeo para guardar un tod o
    @PostMapping(value = "api/todo")
    public Todo save(@RequestBody Todo todo) {

        return service.save(todo);
    }
    //mapeo para editar un tod o
    @PutMapping(value = "api/todo")
    public Todo update(@RequestBody Todo todo) {
        if (todo.getId() != null) {
            return service.save(todo);
        }
        throw new RuntimeException("No existe ese todo");
    }
    //mapeo para eliminar un tod o
    @DeleteMapping(value = "api/{id}/todo")
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);

    }
    //mapeo para traer un tod o por el id
    @GetMapping(value = "api/{id}/todo")
    public Todo get(@PathVariable("id") Long id) {
        return service.get(id);
    }
}
