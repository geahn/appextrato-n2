import React from "react";
import Contas from "./Contas";

class Listagem extends React.Component {
    constructor() {
        super();
        this.state = { 
            situacao: "", //contas a pagar ou a receber
            entradas: [
                //{  valor: 1000, desc: "Capital de Giro", horario: this.definirDataHora()  }
            ]
        }
        
        this.contasPagar = this.contasPagar.bind(this);
        this.contasReceber = this.contasReceber.bind(this);
        this.setContas = this.setContas.bind(this);
    }

    // const [extrato, setExtrato] = useState({});

    addZero(numero){
        if (numero <= 9) 
            return "0" + numero;
        else
            return numero;
    }

    definirDataHora(){
        const getData = new Date();
        const dia = getData.getDate();
        const mes = getData.getMonth() + 1;
        const ano = getData.getFullYear();
        const data = this.addZero(dia) + "/" + this.addZero(mes) + "/" + ano;
        
        const hora = new Date().toLocaleTimeString();

        return data + " " + hora;
    }

    converterMoeda = (e) => {
        return e.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }

    estiloPosNeg = (e) => {
        if (e >= 0)
            return "valorpositivo";
        else
            return "valornegativo"
    }

    contasPagar() {
        this.setState({situacao: "pagar"})
        this.exibirContas()
    }

    contasReceber() {
        this.setState({situacao: "receber"})
        this.exibirContas()
    }

    exibirContas() {
        let elemento1 = document.getElementById("contas");
        elemento1.className = "card card-mini m5";

        let elemento2 = document.getElementById("tabela");
        elemento2.className = "hide";

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

        // console.log("Valor a " + this.state.situacao + ": " + contaValor)
        // console.log("Descrição: " + contaDesc)

        this.setState(prevState => ({
            entradas: [...prevState.entradas, { 
                valor: contaValor,
                desc: contaDesc,
                horario: this.definirDataHora()
             }]
          }))
        
        // this.setState({
        //     desc: contaDesc,
        //     horario: this.definirDataHora(),
        //     valor: contaValor
        // }

    }

    mostraMapaExtrato() {
        const mapaExtrato = this.state.entradas.map((mapa, index) =>
            <tr key={index}>
                <td>{mapa.horario}</td>
                <td>{mapa.desc}</td>
                <td><b className={this.estiloPosNeg(mapa.valor)}> {this.converterMoeda(mapa.valor)}</b></td>
            </tr>)
            if (this.state.entradas.length > 0) {
                return( 
                    <div id="tabela">
                    <table border="0">
                      <thead>
                        <tr>
                            <td><b>Horário</b></td>
                            <td><b>Descrição</b></td>
                            <td><b>Valor</b></td>
                        </tr>
                      </thead>
                      <tbody>
                        {mapaExtrato}
                      </tbody> 
                    </table>
                    </div>
                    )
            } else {
                return <div className="aviso_uso">Adicione uma conta a pagar ou a receber.</div>
            }
    }

    render(){
        if(!localStorage.getItem('username')) {
            window.location = "/";
        }

        const valorTotal=(this.state.entradas.reduce((extrato,currentItem) =>  extrato = extrato + currentItem.valor , 0 ));

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
                                <b>{this.converterMoeda(valorTotal)}</b>
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
                        <b className={this.estiloPosNeg(valorTotal)}> {this.converterMoeda(valorTotal)}</b>
                    </div>
                </nav>

                {this.mostraMapaExtrato()}   

                <Contas situacao={this.state.situacao} metodo={this.setContas} />

            </div>
        )
    }
}

export default Listagem;