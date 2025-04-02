import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useRef, useEffect } from 'react';

type Props = {
  tod: Todo;
  handleRemoveTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  tod: { id, title, completed },
  handleRemoveTodo,
  isLoading,
  loadingTodoId,
  handleUpdateTodoChecked,
  handleUpdateTitle,
}) => {
  const [isEditingTodo, setEditingtTodo] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title);

  const isDeleting = Array.isArray(loadingTodoId) && loadingTodoId.includes(id);
  const isAdding = isLoading && id === 0;

  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [isEditingTodo]);

  const onBlurInput = () => {
    const trimmedTitle = editTitle.trim();

    handleUpdateTitle({ id, title: trimmedTitle });
    setEditingtTodo(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (editTitle === '') {
        return handleRemoveTodo(id);
      }

      if (editTitle === title) {
        return setEditingtTodo(false);
      }

      handleUpdateTitle({ id, title: editTitle.trim() });
      setEditingtTodo(null);
    }

    if (event.key === 'Escape') {
      setEditingtTodo(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={completed ? 'todo completed' : 'todo'}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodoChecked({ id, completed })}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => {
          setEditingtTodo(true);
          setEditTitle(title);
        }}
      >
        {isEditingTodo ? (
          <form>
            <input
              ref={titleFocus}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={event => {
                setEditTitle(event.target.value);
              }}
              onBlur={onBlurInput}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          title
        )}
      </span>
      {!isEditingTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleRemoveTodo(id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
