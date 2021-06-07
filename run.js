'use strict'

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');

const questionTools = [
  {
    type:"list",
    name:"Tools",
    message:"Pilih tools:",
    choices:
      [
        "[=>]  Follow Followers Target ~ with Comment",
        "[=>]  Follow Followers Target ~ with DM",
        "[=>]  Follow Followers Target ~ No Like",
        "[=>]  Unfollow Not Followback",
        ""
      ] 
  }
]

const main = async () => {
  var spinner;
  try{
    var toolChoise = await inquirer.prompt(questionTools);
    toolChoise = toolChoise.Tools;
    switch(toolChoise){
      case "[=>]  Follow Followers Target ~ with Comment":
        await require("./tools/FFT.js");
        break;
      case "[=>]  Follow Followers Target ~ with DM":
        await require("./tools/FFTDM.js");
        break;
      case "[=>]  Follow Followers Target ~ No Like":
        await require("./tools/FFTnoLike.js");
        break;
      case "[=>]  Unfollow Not Followback":
        await require("./tools/unfollowNotFollowBack.js")
        break;
      default:
        console.log('\nERROR:\n[?] Aw, Snap! \n[!] Ada yang salah saat menampilkan program ini! \n [!] Silakan coba lagi!');
    }
  } catch(e) {
    //spinner.stop(true);
    //console.log(e);
    //ZheAlHaqy
  }
}

console.log(chalk`
  {red.yellow

  ____  __    __   __    ____  __  ___ 
(_  _)/  \  /  \ (  )  / ___)(  )/ __)
  )( (  O )(  O )/ (_/\\___ \ )(( (_ \
 (__) \__/  \__/ \____/(____/(__)\___/
                            © 2021
                           ZH3H4CK 
                          ---------     
{bold.green
Github : ZheHacK@github.com
Insta  : instagram.com/zhe_alhaqy
Website: www.rojialhaqy.com
___________________________________}
}
      `);

main()
