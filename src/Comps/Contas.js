import React from "react";
import axios from 'axios';

class Contas extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            valor: this.props.valor,
            desc: this.props.desc,
            situacao: this.props.situacao,
            id_transacao: this.props.id_transacao
        }
}

exibirExtrato = () => {
    let elemento1 = document.getElementById("tabela");
    elemento1.className = "show";

    let elemento2 = document.getElementById("contas");
    elemento2.className = "hide";

    let elemento3 = document.getElementById("msgerro");
    elemento3.className = "msgerro hide";

    let elemento4 = document.getElementById("conta_desc");
    elemento4.className = "";

    this.limparInput();
}

aoMudarValor = (e) => {
    this.setState({ valor: e.target.value });
};

aoMudarDesc = (e) => {
    this.setState({ desc: e.target.value });
};

addConta = (e) => {

    let tipo = ""
    if (this.props.situacao === "pagar") {
        tipo = "P"
    } else {
        tipo = "R"
    }

    this.validaDados(this.state.valor, this.state.desc)

    let valor = this.state.valor.replace(",", ".")

    if (!this.props.id_transacao) {
        
        var url = 'https://danielapi.herokuapp.com/public_html/api';
        //var url = 'http://localhost/react/public_html/api';
        axios.post(url+'/transaction',
                { 
                    user_id: localStorage.getItem('id'),
                    type: tipo,
                    description: this.state.desc,
                    value: valor
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error);
                });

        
    } else {

        var url = 'https://danielapi.herokuapp.com/public_html/api';
        axios.put(url+'/transaction', {
            user_id: localStorage.getItem('id'),
            value: this.state.valor,
            transaction_id: this.props.id_transacao
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    this.props.metodo(this.state.valor, this.state.desc)
    this.limparInput()
    this.exibirExtrato()
}

limparInput() {
    this.setState({
        valor: "",
        desc: "",
        situacao: "",
        id_transacao: ""
        })
}

validaDados = (valor, desc) => {

    if(valor === "" || desc === "") {
        let elemento1 = document.getElementById("msgerro");
        elemento1.className = "msgerro show";

        this.preventDefault();
    } else {
        let elemento1 = document.getElementById("msgerro");
        elemento1.className = "msgerro hide";
    }
    
}

componentDidUpdate(prevProps) {
    if (this.props.valor != prevProps.valor) {
      this.setState({
        desc: this.props.desc,
        valor: this.props.valor
      });
    }
  }

    render(){
        return(            
            <div id="contas" className="hide">
                <h1>Contas a {this.props.situacao}</h1>
                <hr />

                <div id="msgerro" className="msgerro hide">Preencha todos os campos!</div>

                <h3>{this.props.desc}</h3>

                <div className="">
                    <input
                        type="text"
                        id="conta_desc"
                        name="conta_desc"
                        placeholder="Descrição"
                        value={this.state.desc}
                        onChange={this.aoMudarDesc}
                    ></input>
                </div>

                <div className="">
                    <input
                        type="number"
                        id="conta_valor"
                        name="conta_valor"
                        placeholder="Valor"
                        value={this.state.valor}
                        onChange={this.aoMudarValor}
                    ></input>
                </div>

                <button type="submit" onClick={this.addConta}>
                    Adicionar <ion-icon name="add-circle-sharp"></ion-icon>
                </button>
                <button type="submit" className="cancelar" onClick={this.exibirExtrato}>
                    Cancelar <ion-icon name="trash"></ion-icon>
                </button>
            </div>
        )
    }
}

export default Contas;