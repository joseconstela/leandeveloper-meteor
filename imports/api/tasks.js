import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
});