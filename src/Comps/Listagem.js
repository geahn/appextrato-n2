import React from "react";
import Contas from "./Contas";
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';

class Listagem extends React.Component {
    constructor() {
        super();
        this.state = { 
            situacao: "", //contas a pagar ou a receber
            id_transacao: "",
            descricao: "",
            valor: "",
            entradas: []
        }
        
        this.contasPagar = this.contasPagar.bind(this);
        this.contasReceber = this.contasReceber.bind(this);
        this.setContas = this.setContas.bind(this);


        var url = 'https://danielapi.herokuapp.com/public_html/api';
        axios.get(url+'/transaction/'+localStorage.getItem('id'))
        .then((res) => {

            for (let i=0; i < (res.data['data']).length; i++) {

                const id_trans = res.data['data'][i]['id'];
                const desc = res.data['data'][i]['description'];
                let valor = res.data['data'][i]['value_u'];
                const data = res.data['data'][i]['updated_at'];
                const tipo = res.data['data'][i]['type'];

                if (tipo === "P") {
                    valor = -Math.abs(valor)
                } else {
                    valor = Math.abs(valor)
                }

                this.setState({ entradas: [...this.state.entradas,
                    {id: id_trans, valor: valor, desc: desc, horario: data }
                ]})
            }
        })

    }

    addZero(numero){
        if (numero <= 9) 
            return "0" + numero;
        else
            return numero;
    }

    definirDataHora(){
        return Date.now();
    }

    converterMoeda = (e) => {
        return numeral(e).format('$ 00.00');
    }

    estiloPosNeg = (e) => {
        if (e >= 0)
            return "valorpositivo";
        else
            return "valornegativo"
    }

    posNeg = (e) => {
        if (e >= 0)
            return 
    }

    contasPagar() {
        this.setState({
            situacao: "pagar",
            id_transacao: "",
            descricao: "",
            valor: "",
        })
        this.exibirContas()
    }

    contasReceber() {
        this.setState({
            situacao: "receber",
            id_transacao: "",
            descricao: "",
            valor: "",
        })
        this.exibirContas()
    }

    exibirContas() {
        let elemento1 = document.getElementById("contas");
        elemento1.className = "card card-mini m5";

        let elemento2 = document.getElementById("tabela");
        elemento2.className = "hide";

        document.getElementById('meumenu').style.left = '-350px'
    }

    chamaConta(id) {

        var url = 'https://danielapi.herokuapp.com/public_html/api';
        axios.get(url+'/transaction/'+localStorage.getItem('id')+'/'+id)
            .then((res) => {
            
            const id_transacao = res.data['data']['id'];
            const descricao = res.data['data']['description'];
            const valor = res.data['data']['value_u'];
            let situacao = "";

            if (res.data['data']['type'] === "P") {
                situacao = "pagar";
            } else {
                situacao = "receber";
            }

            this.setState({
                situacao: situacao,
                id_transacao: id_transacao,
                descricao: descricao,
                valor: valor
            })

        })

        let elemento1 = document.getElementById("contas");
        elemento1.className = "card card-mini m5";

        let elemento2 = document.getElementById("tabela");
        elemento2.className = "hide";

        let elemento3 = document.getElementById("conta_desc");
        elemento3.className = "hide";

        document.getElementById('meumenu').style.left = '-350px'

    }

    logoff() {
        localStorage.clear();
        window.location = "/";
    }

    setContas(contaValor, contaDesc) {
        contaValor = contaValor.replace(",", ".")
        contaValor = contaValor.replace("R$", "")

        if (this.state.situacao === "pagar") {
            contaValor = -Math.abs(contaValor)
        } else {
            contaValor = Math.abs(contaValor)
        }

        this.setState(prevState => ({
            entradas: [...prevState.entradas, { 
                valor: contaValor,
                desc: contaDesc,
                horario: this.definirDataHora()
             }]
          }))

    }

    verifica(data) {
        let verificar = moment(data)
        let ontem = moment().subtract(1,'d')
        if (ontem >= verificar) {return "naoedita" } else {return "edita"}
    }

    render(){
        if(!localStorage.getItem('username')) {
            window.location = "/";
        }

        const valorTotal=(this.state.entradas.reduce((extrato,currentItem) =>  extrato = extrato + currentItem.valor , 0 ));

        const mapaExtrato = this.state.entradas.reverse().map((mapa, index) =>
            <tr id={"id_"+mapa.id} key={index}>
                <td>{moment(newFunction(mapa)).format("DD/MM/YYYY hh:mm:ss")}</td>
                <td>{mapa.desc}</td>
                <td><b className={this.estiloPosNeg(mapa.valor)}> R{this.converterMoeda(mapa.valor).replace("-", "").replace(".",",")}</b></td>
                <td>
                    <a href={"#"+mapa.id} onClick={() => this.chamaConta(mapa.id)} className={this.verifica(mapa.horario)}>
                        <ion-icon name="build"></ion-icon>
                    </a>
                </td>
            </tr>)

        return(
            <div>
                <nav>
                    <ion-icon size="large" id="menuhamb" name="menu-sharp"
                      onclick="document.getElementById('meumenu').style.left = '0px'">
                    </ion-icon>
                    <div className="logoapp logomini"></div>
                    <div id="meumenu">
                        <div className="boxed">
                            <ion-icon size="large" id="xfechar" name="close"
                              onclick="document.getElementById('meumenu').style.left = '-350px'">
                            </ion-icon>

                            <div className="usuario">
                                <ion-icon name="person"></ion-icon>
                                Olá, {localStorage.getItem('username')}!
                            </div>

                            <span className="menusaldo">
                                SALDO TOTAL<br />
                                <b>R{this.converterMoeda(valorTotal).replace("-", "").replace(".",",")}</b>
                            </span>

                            <div className="btmenu">

                                <button onClick={this.contasPagar}>
                                    <ion-icon name="arrow-redo"></ion-icon>
                                    Contas a pagar
                                </button>

                                <button onClick={this.contasReceber}>
                                    <ion-icon name="arrow-undo"></ion-icon>
                                    Contas a receber
                                </button>
                            </div>
                            <a className="sair" onClick={this.logoff} href="#sair">
                                Sair <ion-icon name="power"></ion-icon>
                            </a>
                        </div>
                    </div>

                    <div className="valortotal">
                        <span>Saldo: </span>
                        <b className={this.estiloPosNeg(valorTotal)}> R{this.converterMoeda(valorTotal).replace("-", "").replace(".",",")}</b>
                    </div>
                </nav>

                <div id="tabela">
                    <table border="0">
                      <thead>
                        <tr>
                            <td><b>Horário</b></td>
                            <td><b>Descrição</b></td>
                            <td><b>Valor</b></td>
                            <td><b>Editar</b></td>
                        </tr>
                      </thead>
                      <tbody>
                        {mapaExtrato}
                      </tbody> 
                    </table>
                </div>

                <Contas situacao={this.state.situacao} id_transacao={this.state.id_transacao} desc={this.state.descricao} valor={this.state.valor} metodo={this.setContas} />

            </div>
        )

        function newFunction(mapa) {
            return mapa.horario;
        }
    }
}

export default Listagem;