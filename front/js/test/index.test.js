/**
 * @jest-environement jsdom
 */

const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals')
const { default: userEvent } = require('@testing-library/user-event')


beforeEach(()=>{
    document.body.innerHTML =  `
        <form id="form">
            <div class="form-group">
                <label for="prenom">Votre prénom</label>
                <input type="text" class="form-control my-3" id="prenom">
            </div>
            <button type="submit" class="btn btn-primary">Voir la liste des tâches</button>
        </form>
    `
})
afterEach(()=>{
    document.body.innerHTML =""
})

describe('test formulaire', ()=>{
    it('Le champ input est bien rempli', () => {
        const input = document.querySelector("#prenom")
        input.value = "Marie"
        expect(input.value).toBe("Marie")
    })
    
})