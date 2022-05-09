let cart = [];
let modalQt = 1;
let modalKey = 0;


//Para organização do código
//Funções document.querySelector e querySelectorAll reduzidas a constantes
// declarar uma constante + (recebe um elemento) e retorna um elemento (Função arrow)
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


//Mapeia a array pizzaJson e em cada item será realizada uma ação;
//Mapeia com uma função arrow .map a qual receberá 2 itens de pizza.js - (item, índice do item 0,1,2...6)
pizzaJson.map((item, index)=>{
    //Cada item irá clonar a estrutura do HTML
    //No caso será clonada a estrutura da div .models . pizza-item
    /*A função document.querySelector e documentSelectorAll é reduiza a
    uma constante c e cs, respectivamente no início do script para uma melhor organização*/
    let pizzaItem = c('.models .pizza-item').cloneNode(true);  
    
    //Determina uma Key para o item selecionado
    pizzaItem.setAttribute('data-key', index);

    //Prenche as informações de pizza-item com base na array em pizza.js
    //O comando innerHTML substitui o item existente por um outro solicitado
    //querySelector - comando para selecionar:
    //variavel.querySelector(div especificada do HTML).innerHTML = item.variaveldoarray
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //Será adicionado aqui um evento na tag 'a'
                       //comando.addEventlistener('comando click', função a ser executada)
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        //bloquear a ação natural de atualizar a tela ao clicar na tela
        e.preventDefault();
        
        /*COMANDO BEM ESPECÍFICO - TARGET: Referencia o elemento o qual disparou o evento 'addEventLister':
        No caso o evento da variável 'a' foi o qual disparou.
        A função closest irá pegar o parâmetro mais próximo ao 'a', no caso '.pizza-item'
        A função getAttribute irá guardar a informação de data-key;*/
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //Continua como padrão a quantidade de pizzas como 1 unidade
        modalQt = 1;

        //Armazena a informação da pizza selecionada
        modalKey = key;

        //Ações ao clicar no ícone:
        //1 - exibe o pizzaWindowArea com um opacity = 0
        c('.pizzaWindowArea').style.opacity = 0;
        
        //2 - Transforma o display em flex 
        c('.pizzaWindowArea').style.display = 'flex';
        
        //3 - Transforma o opacity em 1/5 de segundo para 100% 
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

        //INFORMAÇÕES DOS ITENS no card(modal) interno
        
        //Informações básicas
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        //Retira para depois colocar como padrão o terceiro item [2] como pré-marcado ao mudar de card dos itens
        c('.pizzaInfo--size.selected').classList.remove('selected');
        
        //Seletor dos itens (gramas por pizza)
        //Utilizado o querySelectorAll 
        //forEach - determina para cada parâmetro o que será feito
        //forEach(característica, índice da característica)
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            //coloca novamente a marcação no item [2]
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

    });
    //Determina como padrão a quantidade de pizzas ao abrir o card
    c('.pizzaInfo--qt').innerHTML = modalQt;

    //O comando append, ao contrário do innerHTML, adiciona o conteúdo
    //No caso será adicionado em pizza-area o item pizzaItem
    c('.pizza-area').append( pizzaItem );
});

//Função para fechar o card(MODAL)
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
//Função querySelectorAll
//Ao clicar no botão cancelar no pc ou voltar no mobile, a função closeModal é executada
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Botões + e - 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){ //Condicional para diminuir somente se o valor for maior que 1
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

//Seletor de tamanho da pizza escolhida
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Guarda a informação da pizza com a data-key - Tamanho da pizza
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));//Parse transforma de string para var

    //Identificador utilizado para organizar as pizzas repetidas no cart; Resolverá o problema de arrays repetidas com o mesmo id da pizza
    //Junta o ID da pizza + o tamanho
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //Verifica no cart se há lista com o mesmo identifiew
    let key = cart.findIndex((item)=>item.identifier == identifier);

        //Caso haja, ele adiciona a existente
        if(key > -1){
            cart[key].qt += modalQt;
        } else{
            //Cart é uma array(lista)
            //Comando push irá adicionar os dados coletados na lisa (Pizza, tamanho e quantidade)
            cart.push({
                identifier,
                id:pizzaJson[modalKey].id, //A partir do modalKey, é obtido o id
                size, //Tamanho
                qt:modalQt //Quantidade
            });
        }
    updateCart();
    closeModal();
    
})

//Menu do carrinho no celular 
c('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0 ) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left='100vw';
})

//Função que irá mostrar o carrinho
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        
        c('aside').classList.add('show'); //Se a quantidade de itens na lista for maior que 0, o cart será exibido
        c('.cart').innerHTML = '';

        //Declara as variáveis subtotal, desconto e total;
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);//Pizza Item irá retornar pelo Id de Json
            subtotal += pizzaItem.price * cart[i].qt; //Subtotal será calculada pelo price do item e a quantidade pelo cart

            let cartItem = c('.models .cart--item').cloneNode(true);//A div cartItem irá receber as informações
            
            //As posições 0, 1, 2 serão substituídas por P, M e G
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            //pizzaName será concatenado com pizzaItem.name e pizzaSizename
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //Itens colocados noo Cart
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);

        };

        //Após o looping, o desconto é calculado pelo subtotal definido
        desconto = subtotal * 0.1;
        //total é calculado novamente com base no subtotal e desconto 
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        //Retira a propriedade 'show' da div no PC
        c('aside').classList.remove('show');
        //Retira a propriedade 'show' da div no celular
        c('aside').style.left = '100vw';
    }
}

