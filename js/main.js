const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your API endpoint

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('item-form');
    const itemList = document.getElementById('item-list');
    const itemNameInput = document.getElementById('item-name');

    async function fetchItems() {
        const response = await fetch(API_URL);
        const items = await response.json();
        renderItems(items);
    }

    function renderItems(items) {
        itemList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `
                ${item.title}
                <button class="bg-red-500 text-white p-1 ml-2 rounded" onclick="deleteItem(${item.id})">Delete</button>
                <button class="bg-yellow-500 text-white p-1 ml-2 rounded" onclick="editItem(${item.id}, '${item.title}')">Edit</button>
            `;
            itemList.appendChild(li);
        });
    }

    async function addItem(name) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: name })
        });
        const newItem = await response.json();
        fetchItems();
    }

    async function deleteItem(id) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchItems();
    }

    function editItem(id, currentTitle) {
        itemNameInput.value = currentTitle;
        form.onsubmit = async (e) => {
            e.preventDefault();
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: itemNameInput.value })
            });
            itemNameInput.value = '';
            form.onsubmit = async (e) => {
                e.preventDefault();
                await addItem(itemNameInput.value);
                itemNameInput.value = '';
            };
            fetchItems();
        };
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addItem(itemNameInput.value);
        itemNameInput.value = '';
    });

    fetchItems();
});
