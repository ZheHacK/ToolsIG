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
console.log(chalk`{bold.red   ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••}`);
console.log(chalk`{bold.red   •                                                         •}`);
console.log(chalk`{bold.red   •  Ξ TITLE  : Folow Like Comment (Followers Target) v2    •}`);
console.log(chalk`{bold.red   •  Ξ NOTE   : Only Single Target, v2 of the previous tool •}`);
console.log(chalk`{bold.red   •                                                         •}`);
console.log(chalk`{bold.red   •••••••••••••••••••••••••••••••••••••••••••••••••••@ZheHacK}\n`);
    const questions = [
        {
            type: "input",
            name: "username",
            message: "Input username:",
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
        print(`Logged in as @${login.username} (ID: ${login.pk})`, "ok");
        print(`Collecting information of @${target} . . .`, "wait");
        const id = await ig.getIdByUsername(target),
            info = await ig.userInfo(id);
        if (!info.is_private) {
            print(`@${target} (ID: ${id}) => Followers: ${info.follower_count}, Following: ${info.following_count}`, "ok");
            const getMyFollowers = async () => {
                let followers = [];
                try {
                    const get = await ig.followersFeed(login.pk);
                    do {
                        let items = await get.items();
                        await Promise.all(items.map((follower) => followers.push(follower.pk)));
                    } while (get.moreAvailable);
                    return Promise.resolve(followers);
                } catch (err) {
                    return Promise.reject(err.message);
                }
            };
            const getMyFollowing = async () => {
                let following = [];
                try {
                    const get = await ig.followingFeed(login.pk);
                    do {
                        let items = await get.items();
                        await Promise.all(items.map((follows) => following.push(follows.pk)));
                    } while (get.moreAvailable);
                    return Promise.resolve(following);
                } catch (err) {
                    return Promise.reject(err.message);
                }
            };
            const get = [getMyFollowers(), getMyFollowing()];
            const [myFollowers, myFollowing] = await Promise.all(get);
            const targetFollowers = await ig.followersFeed(id);
            print(`Doing task with ratio ${perExec} target / ${delayTime} milliseconds \n`, "wait");
            do {
                let items = await targetFollowers.items();
                items = _.chunk(items, perExec);
                for (let i = 0; i < items.length; i++) {
                    await Promise.all(
                        items[i].map(async (follower) => {
                            if (!follower.is_private && !myFollowing.includes(follower.pk) && !myFollowers.includes(follower.pk)) {
                                const media = await ig.userFeed(follower.pk),
                                    lastMedia = await media.items();
                                var text = fs.readFileSync('./commentText.txt', 'utf8').split('|');
                                var msg = text[Math.floor(Math.random() * text.length)];
                                if (lastMedia.length != 0 && lastMedia[0].pk) {
                                    const task = [ig.follow(follower.pk), ig.like(lastMedia[0].pk), ig.comment(lastMedia[0].pk, msg)];
                                    let [follow, like, comment] = await Promise.all(task);
                                    follow = follow ? chalk.bold.green(`Follow`) : chalk.bold.red("Follow");
                                    like = like ? chalk.bold.green("Like") : chalk.bold.red("Like");
                                    comment = comment ? chalk.bold.green("Comment") : chalk.bold.red("Comment");
                                    print(`▲ @${follower.username} ⇶ [${follow}, ${like}, ${comment}] ⇶ ${chalk.cyanBright(msg)}`);
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
