import { fs } from "fs/promises";
import path from "path";

const contactsPath = path.join(__dirname, "db/contacts.json");

/**
 * Returns the list of contacts.
 *
 * @returns {Promise<Array>} - The list of contacts
 */
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    printError(error);
  }
}

/**
 * Returns the contact by id.
 * Or null if contact not found.
 *
 * @param {int} contactId
 * @returns {Promise<Object|null>} - The contact
 */
async function getContactById(contactId) {
  try {
    return (await listContacts()).find(({ id }) => id === contactId) ?? null;
  } catch (error) {
    printError(error);
  }
}

/**
 * Removes the contact by id.
 * Returns the removed contact.
 *
 * @param {int} contactId
 * @returns
 */
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const idx = contacts.findIndex(({ id }) => id === contactId);

    if (idx === -1) {
      return null;
    }

    const [removedContact] = contacts.splice(idx, 1);

    await saveContacts(contacts);
    return removedContact;
  } catch (error) {
    printError(error);
  }
}

/**
 * Adds a new contact to the list.
 *
 * @param {string} name - The name of the contact
 * @param {string} email - The email of the contact
 * @param {phone} phone - The phone of the contact
 * @returns {Promise<{Object}>} - The new contact
 */
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const id = getNewContactId(contacts);
    const newContact = { id, name, email, phone };
    contacts.push(newContact);
    await saveContacts(contacts);
    return newContact;
  } catch (error) {
    printError(error);
  }
}

/**
 * Saves the list of contacts.
 *
 * @param {Array<Object>} contacts
 */
async function saveContacts(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    printError(error);
  }
}
/**
 * Returns id for the new contact.
 *
 * @param {Array<Object>} contacts
 * @returns
 */
function getNewContactId(contacts) {
  return contacts.length > 0
    ? Math.max(...contacts.map(({ id }) => id)) + 1
    : 1;
}

/**
 * Prints an error message to the console.
 * @param {*} error
 */
function printError(error) {
  console.error("\x1B[31m Error: ", error);
}

export { listContacts, getContactById, removeContact, addContact };
