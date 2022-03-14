const { execute } = require('./core');

const clone = async (coverageBranch, repository) => {
    const cloneInto = `repo-${new Date().getTime()}`;

    console.log(`Cloning repository ${repository} in ${cloneInto}`);
    await execute(`git clone ${repository} ${cloneInto}`);

    console.log(`Retrieving existing branches`);
    const list = await execute(`git branch -a`, { cwd: cloneInto });
    const branches = list.split('\n').filter(b => b.length > 2).map(b => b.replace('remotes/origin/', '').trim());
    branches.forEach(element => console.log(element));

    if (branches.includes(coverageBranch)) {
        console.log(`Coverage branch exists. Checking it out.`);
        await execute(`git checkout ${coverageBranch}`, { cwd: cloneInto });
        console.log(`git checkout ${coverageBranch}`);
        const currentBranch = await execute(`git branch`, { cwd: cloneInto });
        console.log(`git checkout ${currentBranch}`);
        await execute(`git pull`, { cwd: cloneInto });
        console.log(`git pull completed`);
    } else {
        console.log(`Coverage branch does not exist. Creating it.`);
        await execute(`git checkout --orphan ${coverageBranch}`, { cwd: cloneInto });
        await execute(`sudo rm -rf .`, { cwd: cloneInto });
    }

    return cloneInto;
};

const push = async (cwd, repo) => {
    await execute('git config --local user.email ketankumar.limbachiya@lhind.dlh.de', { cwd });
    await execute('git config --local user.name Ketankumar', { cwd });
    await execute('git add .', { cwd });
    await execute('git commit -m "Update coverage info" --allow-empty', { cwd });
    await execute(`git push ${repo} HEAD`, { cwd });
};

export { clone, push };
