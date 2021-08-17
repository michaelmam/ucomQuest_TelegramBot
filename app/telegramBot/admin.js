const {MenuTemplate, MenuMiddleware, createBackMainMenuButtons} = require('telegraf-inline-menu')
const Users = require('../user/user.schema')

const findUsers = async () => {
  return Users.find({role: 'player', first_name: { $exists: true }})
}

const menu = new MenuTemplate(() => 'Admin page')
menu.interact(`User List`, 'userList', {
  do: async (ctx) => {
    ctx.deleteMessage()
    const users = await findUsers()
    let userButtons = [
      [{ text: '<< back', callback_data: 'back' }]
    ];
    for(const user of users){
      userButtons.unshift([
        { text: `code: ${user.code}`, callback_data: `textTo:${user.id}:${user.code}` },
      ])
    };
    ctx.reply(`Users: ${userButtons.length - 1}`, { reply_markup: JSON.stringify({ inline_keyboard: userButtons})})
    return false
  }
});

menu.manualRow(createBackMainMenuButtons('back', 'go to Main menu'))
// menu.submenu('User List', 'userList', userList, {
//   // hide: () => mainMenuToggle,
// })


const menuMiddleware = new MenuMiddleware('admin/', menu)

console.log(menuMiddleware.tree())

module.exports = menuMiddleware
