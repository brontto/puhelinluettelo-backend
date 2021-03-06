const mongoose = require('mongoose')

const generateId = () => {
  return Math.floor(Math.random()*100)
}


if(process.argv.length<3){
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://fullstack2022:${password}@cluster0.7jkv9ts.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length<4){
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
    id: generateId()
  })

  person
    .save()
    .then(result => {
      console.log(`added ${result.name} ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}


