package com.kataCrud.kataCrud;

import org.springframework.data.repository.CrudRepository;

public interface TodoRepository extends CrudRepository <Todo, Long> {
}
