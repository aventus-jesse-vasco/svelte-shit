import { writable } from 'svelte/store';

export const tasks = writable([]);

let nextId = 1;

export function addTask(title) {
  tasks.update((list) => [...list, { id: nextId++, title, done: false }]);
}

export function removeTask(id) {
  tasks.update((list) => list.filter((t) => t.id !== id));
}

export function toggleTask(id) {
  tasks.update((list) =>
    list.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  );
}
