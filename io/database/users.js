const knex = require('./knex')
const {
  createRecord,
  findRecord,
  updateRecord,
  deleteRecord,
  findAllRecords} = require('./utilities')

const createUser = attributes =>
  createRecord('users', attributes).then( user => user )

const findUserByHandle = github_handle => 
  findRecord('users', 'github_handle', github_handle).then(user => user)

const findActiveCoaches = coach_handle => 
  findRecord('users', 'coach_handle', coach_handle)
    .then(user => user)

const updateUserByHandle = (github_handle, attributes) => 
  updateRecord('users', 'github_handle', github_handle, attributes).then(user => user)

const deleteUserByHandle = github_handle =>
  deleteRecord('users', 'github_handle', github_handle)

const getActiveCoaches = () => 
  findAllRecords('users', 'active_coach', true).then(user => user)

const activateCoach = (github_handle) => 
  updateRecord('users', 'github_handle', github_handle, {active_coach: true})

const deactivateCoach = (github_handle) => 
  updateRecord('users', 'github_handle', github_handle, {active_coach: false})

module.exports = {
  knex,
  createUser, 
  findUserByHandle,
  updateUserByHandle,
  deleteUserByHandle,
  getActiveCoaches,
  activateCoach,
  deactivateCoach
}
