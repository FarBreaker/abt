const express = require ('express')
const APP = express()
const PORT = 3000
const SHELLEX = require('shelljs')

//Initialization Sequence
const REPOURL = 'http://obiwan.replynet.prv/' 

let status = {'shell': false,'git': false, 'vpn': false}

//Shell env
if(!SHELLEX.which('zsh'))
{
    SHELLEX.echo('zsh not found, this script requires a normodotated shell env, checking if bash is OK...')
}else if(!SHELLEX.which('bash'))
{ 
    SHELLEX.echo('bash not found, as i already said this script requires normodotated shell env, aborting ...')
    status['shell']=false
    SHELLEX.exit()
}else{
    status['shell']=true
    SHELLEX.echo('Shell env correctly set, proceding checks...')
}
//Git 
if(!SHELLEX.which('git'))
{
    SHELLEX.echo('Git not found, this script require git')
    status['git']= false
    SHELLEX.exit(0)
} else{
    status['git']=true 
    SHELLEX.echo('Git found...')
}
//Connection to obiwan
if(SHELLEX.error( SHELLEX.exec(`curl ${REPOURL}`,{silent:true})))
{
    status['vpn']=false
    SHELLEX.echo("Repository unreachable, please check you connection to internet and/or to the VPN")
}else
{
    status['vpn']=true
    SHELLEX.echo('Connection established proceding...')
}



let branch = 'master'
APP.get('/', (req,res)=>{
    res.send('Branch Switch')
    if(!SHELLEX.error(SHELLEX.exec(`git checkout ${branch}`)))
    {
        branch = 'performance'
        SHELLEX.exec(`git status`)
    }else
    {
        SHELLEX.echo('Error while checking out') 
        SHELLEX.exec('git status')
    }
})

APP.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
    SHELLEX.echo(`Available Services:\n Shell: ${status.shell}\n Git: ${status.git}\n VPN: ${status.vpn}`)
})