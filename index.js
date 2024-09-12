const {select, input, checkbox} = require('@inquirer/prompts')
const fs = require("fs").promises // guardar e reutilizar as metas

//aqui virá um objeto - require me dara um objeto
//importando modulos
let mensagem = "Bem vindo ao app de Metas";

let metas

const carregarMetas = async () =>{
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
            metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvarMetas = async () =>{
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2)) //config arq json
}

const cadastrarMeta = async ()=>{
    const meta = await input ({ message: "Digita a meta: "})

if(meta.length == 0){
        mensagem = "não existem metas"
        return
    }

        if(meta.length == 0){
            mensagem = 'A meta não pode ser vazia'
            return
        }

        metas.push(
            {value: meta, checked: false}
        )
        mensagem = "Meta cadastrada com sucesso!"
    }

const listarMetas = async() =>{

    if(metas.length == 0){
        mensagem = "não existem metas"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudas de meta, o espaço para marcar e desmarcar e o enter para finalizar essa etapa",
        choices: [...metas], //... - spread operator -pega tudo que tem e joga no array
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0){
        mensagem = "Nenhuma meta selecionada"
        return
    } 

   
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

    mensagem = "Metas marcadas como concluidas"
}

const realizadas = async () => {       //Higher Order Functions - Find, ForEach , Map e Filter
    if(metas.length == 0){
        mensagem = "não existem metas"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })              
    if(realizadas.length == 0){
        mensagem = 'Não existe metas realizadas! :('
        return
    }
    await select({
        message: realizadas.length + " metas Realizadas no total.",
        choices: [...realizadas]
    })
}

const metasAbertas = async () =>{

    if(metas.length == 0){
        mensagem = "Não existem metas"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0){
        mensagem = "Não existem metas abertas! =)"
        return
    }

    await select({
        message: abertas.length + " metas abertas no total.",
        choices: [...abertas]        // 22min25s
    })
}
const deletarMetas = async() =>{

    if(metas.length == 0){
        mensagem = "Não existem metas"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {

        return {value: meta.value, checked: false}
    })

    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })
    if (itemsADeletar.length == 0){
        mensagem = "Nenhum item para deletar"
        return
    }

    itemsADeletar.forEach((item) =>{
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    mensagem = "Metas deletadas com sucesso"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {

    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

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
                    name: "Deletar metas",
                    value: "deletar"
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
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                return
        }
    }
}

start()



