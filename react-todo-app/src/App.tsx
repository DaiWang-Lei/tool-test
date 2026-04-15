import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  editing?: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const newTodoItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    setTodos(
      todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingId) {
        saveEdit();
      } else {
        addTodo();
      }
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>✨ TodoList Pro ✨</h1>
        <p>Organize your life with style</p>
      </div>

      <div className="todo-container">
        <div className="input-section">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button onClick={addTodo} className="add-btn">
            ➕ Add
          </button>
        </div>

        <div className="stats">
          <span className="count">
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
          </span>
          <div className="filter-buttons">
            <button 
              onClick={() => setFilter('all')} 
              className={filter === 'all' ? 'active' : ''}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')} 
              className={filter === 'active' ? 'active' : ''}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={filter === 'completed' ? 'active' : ''}
            >
              Completed
            </button>
          </div>
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">
              {filter === 'all' 
                ? 'No todos yet. Add one above!' 
                : filter === 'active' 
                  ? 'All tasks are complete! 🎉' 
                  : 'No completed tasks yet.'}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}
              >
                {editingId === todo.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="edit-input"
                    />
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="save-btn">✓</button>
                      <button onClick={cancelEdit} className="cancel-btn">✕</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="todo-checkbox"
                      />
                      <span className="todo-text">{todo.text}</span>
                    </div>
                    <div className="todo-actions">
                      <button 
                        onClick={() => startEditing(todo)} 
                        className="edit-btn"
                        aria-label="Edit todo"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="delete-btn"
                        aria-label="Delete todo"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

        {todos.length > 0 && (
          <div className="footer-stats">
            <span>Total: {todos.length}</span>
            <span>Completed: {completedCount}</span>
            <span>Active: {activeCount}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #4b6584, #8e44ad);
          padding: 2rem;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          color: white;
          margin: 0;
          font-size: 2.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .header p {
          color: rgba(255,255,255,0.8);
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }

        .todo-container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .input-section {
          display: flex;
          padding: 1.5rem;
          background: white;
          border-bottom: 1px solid #eee;
        }

        .todo-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px 0 0 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .todo-input:focus {
          border-color: #4b6584;
        }

        .add-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #4b6584, #8e44ad);
          color: white;
          border: none;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .stats {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
          border-bottom: 1px solid #eee;
        }

        .count {
          color: #666;
          font-weight: 500;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-buttons button {
          padding: 0.375rem 0.75rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .filter-buttons button.active {
          background: linear-gradient(135deg, #4b6584, #8e44ad);
          color: white;
          border-color: transparent;
        }

        .filter-buttons button:hover:not(.active) {
          background: #f0f0f0;
        }

        .todo-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .todo-item {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          animation: fadeIn 0.3s ease;
        }

        .todo-item:last-child {
          border-bottom: none;
        }

        .todo-item.completed .todo-text {
          text-decoration: line-through;
          color: #999;
        }

        .todo-item.editing {
          background: #f8f9ff;
        }

        .todo-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .todo-checkbox {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }

        .todo-text {
          font-size: 1.1rem;
          color: #333;
          word-break: break-word;
          max-width: 70%;
        }

        .todo-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          background: #e3f2fd;
          transform: scale(1.1);
        }

        .delete-btn:hover {
          background: #ffebee;
          transform: scale(1.1);
        }

        .edit-form {
          display: flex;
          width: 100%;
          gap: 0.5rem;
        }

        .edit-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .edit-actions {
          display: flex;
          gap: 0.25rem;
        }

        .save-btn, .cancel-btn {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .save-btn {
          background: #4caf50;
          color: white;
        }

        .cancel-btn {
          background: #f44336;
          color: white;
        }

        .empty-state {
          padding: 2rem 1.5rem;
          text-align: center;
          color: #666;
          font-style: italic;
        }

        .footer-stats {
          display: flex;
          justify-content: space-around;
          padding: 1rem;
          background: #f8f9fa;
          font-size: 0.875rem;
          color: #666;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        /* Responsive design */
        @media (max-width: 600px) {
          .app {
            padding: 1rem;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .input-section {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .todo-input {
            border-radius: 8px;
          }
          
          .add-btn {
            border-radius: 8px;
            width: 100%;
          }
          
          .stats {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .todo-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .todo-content {
            width: 100%;
          }
          
          .todo-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}

export default App;