const { chalk, inquirer, _, fs, instagram, print, delay } = require("./index.js");
process.stdout.write('\x1Bc');
(async () => {
    print(
        chalk`{bold.green
  ▄▄▄▄▄            ▄▄▌  .▄▄ · ▪   ▄▄ • 
  •██  ▪     ▪     ██•  ▐█ ▀. ██ ▐█ ▀ ▪
   ▐█.▪ ▄█▀▄  ▄█▀▄ ██▪  ▄▀▀▀█▄▐█·▄█ ▀█▄
   ▐█▌·▐█▌.▐▌▐█▌.▐▌▐█▌▐▌▐█▄▪▐█▐█▌▐█▄▪▐█
   ▀▀▀  ▀█▄▀▪ ▀█▄▀▪.▀▀▀  ▀▀▀▀ ▀▀▀·▀▀▀▀ 
}`
);
console.log(chalk`{bold.red   ••••••••••••••••••••••••••••••••••••••••••••••••••••••}`);
console.log(chalk`{bold.red   •                                                    •}`);
console.log(chalk`{bold.red   •  Ξ TITLE  : Like Comment Only (Followers Target)   •}`);
console.log(chalk`{bold.red   •                                                    •}`);
console.log(chalk`{bold.red   ••••••••••••••••••••••••••••••••••••••••••••••@ZheHacK}\n`);
    const questions = [
        {
            type: "input",
            name: "username",
            message: "Input Username:",
            validate: (val) => val.length != 0 || "Please input username!",
        },
        {
            type: "password",
            name: "password",
            mask: "*",
            message: "Input password:",
            validate: (val) => val.length != 0 || "Please input password!",
        },
        {
            type: "input",
            name: "target",
            message: "Input target's username (without '@'):",
            validate: (val) => val.length != 0 || "Please input target's username!",
        },
        {
            type: "input",
            name: "perExec",
            message: "Input limit per-execution:",
            validate: (val) => /[0-9]/.test(val) || "Only input numbers",
        },
        {
            type: "input",
            name: "delayTime",
            message: "Input sleep time (in milliseconds):",
            validate: (val) => /[0-9]/.test(val) || "Only input numbers",
        },
    ];

    try {
        const { username, password, target, perExec, delayTime, inputMessage } = await inquirer.prompt(questions);
        const ig = new instagram(username, password);
        print("Try to Login . . .", "wait", true);
        const login = await ig.login();
        print(`Logged in as @${login.username} (User ID: ${login.pk})`, "ok");
        print(`Collecting information of @${target} . . .`, "wait");
        const id = await ig.getIdByUsername(target),
            info = await ig.userInfo(id);
        if (!info.is_private) {
            print(`@${target} (User ID: ${id}) => Followers: ${info.follower_count}, Following: ${info.following_count}`, "ok");
            print("Collecting followers . . .", "wait");
            const targetFollowers = await ig.followersFeed(id);
            print(`Doing task with ratio ${perExec} target / ${delayTime} milliseconds \n`, "wait");
            do {
                let items = await targetFollowers.items();
                items = _.chunk(items, perExec);
                for (let i = 0; i < items.length; i++) {
                    await Promise.all(
                        items[i].map(async (follower) => {
                            const status = await ig.friendshipStatus(follower.pk);
                            if (!follower.is_private && !status.following && !status.followed_by) {
                                const media = await ig.userFeed(follower.pk),
                                    lastMedia = await media.items();
                                const text = .readFileSync('./commentText.txt', 'utf8').split('|');
                                const msg = text[Math.floor(Math.random() * text.length)];
                                if (lastMedia.length != 0 && lastMedia[0].pk) {
                                    const task = [ig.like(lastMedia[0].pk), ig.comment(lastMedia[0].pk, msg)];
                                    let [like, comment] = await Promise.all(task);
                                    like = like ? chalk.bold.green("Like") : chalk.bold.red("Like");
                                    comment = comment ? chalk.bold.green("Comment") : chalk.bold.red("Comment");
                                    print(`▲ @${follower.username} ⇶ [${like}, ${comment}] ⇶ ${chalk.cyanBright(msg)}`);
                                } else print(chalk`▼ @${follower.username} ⇶ {yellow No posts yet, Skip.}`);
                            } else print(chalk`▼ @${follower.username} ⇶ {yellow Private or already followed/follows you, Skip.}`);
                        })
                    );
                    if (i < items.length - 1) print(`Current Account: (${login.username}) » Delay: ${perExec}/${delayTime}ms \n`, "wait", true);
                    await delay(delayTime);
                }
            } while (targetFollowers.moreAvailable);
            print(`Status: All Task done!`, "ok", true);
        } else print(`@${target} is private account`, "err");
    } catch (err) {
        print(err, "err");
    }
})();
//by 1dcea8095a18ac73b764c19e40644b52 116 111 111 108 115 105 103  118 51
