const {select, input, checkbox} = require('@inquirer/prompts')
//aqui virá um objeto - require me dara um objeto
//importando modulos
let meta = {
    value: 'Tomar 3L de agua todo dia',
    checked: false,
}

let metas = [ meta ]

const cadastrarMeta = async ()=>{
    const meta = await input({ message: "Digite a meta:"})

        if(meta.length == 0){
            console.log('A meta não pode ser vazia')
            return
        }

        metas.push(
            {value: meta, checked: false}
        )
    }

const listarMetas = async() =>{
    const respostas = await checkbox({
        message: "Use as setas para mudas de meta, o espaço para marcar e desmarcar e o enter para finalizar essa etapa",
        choices: [...metas], //... - spread operator -pega tudo que tem e joga no array
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0){
        console.log("Nenhuma meta selecionada.")
        return
    } 

   
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

    console.log ('Meta(s) Concluidas')
}

const realizadas = async () => {       //Higher Order Functions - Find, ForEach e Filter
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })              
    if(realizadas.length == 0){
        console.log('Não existe metas realizadas! :(')
        return
    }
    await select({
        message: "Metas Realizadas",
        choices: [...realizadas]
    })
}

const metasAbertas = async () =>{
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0){
        console.log("Não existem metas abertas! =)")
        return
    }

    await select({
        message: "Metas abertas",
        choices: [...abertas]        // 22min25s
    })
}

const start = async () => {

    while(true){

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })
        
        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await realizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "sair":
                return
        }
    }
}

start()