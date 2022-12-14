import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default class ExistenciaTableRow extends Component {
  constructor(props) {
    super(props);
    this.venta = this.venta.bind(this);
    this.compra = this.compra.bind(this);
    this.onChangeCantidadV = this.onChangeCantidadV.bind(this);
    this.onChangeCantidadC = this.onChangeCantidadC.bind(this);
    this.state = {
      showV: false,
      showC: false,
      cantidad: "",
      cantidadV: "",
      cantidadC: "",
    };
  }

  onChangeCantidadV(e) {
    this.setState({ cantidadV: e.target.value });
  }
  onChangeCantidadC(e) {
    this.setState({ cantidadC: e.target.value });
  }

  venta() {
    axios
      .get(
        "https://backend-drogueria.vercel.app/existencias/obtener-existencia/" +
          this.props.obj._id
      )
      .then((res) => {
        const entradaObject = {
          proveedorCliente: res.data.proveedorCliente,
          cantidad: this.state.cantidadV,
          nombreProducto: res.data.nombreProducto,
          lab: res.data.lab,
        };
        this.setState({
          cantidad: Number(res.data.cantidad) - Number(this.state.cantidadV),
        });
        const ventaObject = {
          cantidad: this.state.cantidad,
        };
        axios
          .put(
            "https://backend-drogueria.vercel.app/existencias/actualizar-existencia/" +
              this.props.obj._id,
            ventaObject
          )
          .then(() => {
            axios
              .post(
                "https://backend-drogueria.vercel.app/salidas/crear-salida/",
                entradaObject
              )
              .then(() => {
                window.location = "/home";
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  compra() {
    axios
      .get(
        "https://backend-drogueria.vercel.app/existencias/obtener-existencia/" +
          this.props.obj._id
      )
      .then((res) => {
        const entradaObject = {
          proveedorCliente: res.data.proveedorCliente,
          cantidad: this.state.cantidadC,
          nombreProducto: res.data.nombreProducto,
          lab: res.data.lab,
        };
        this.setState({
          cantidad: Number(res.data.cantidad) + Number(this.state.cantidadC),
        });
        const compraObject = {
          cantidad: this.state.cantidad,
        };
        axios
          .put(
            "https://backend-drogueria.vercel.app/existencias/actualizar-existencia/" +
              this.props.obj._id,
            compraObject
          )
          .then(() => {
            axios
              .post(
                "https://backend-drogueria.vercel.app/entradas/crear-entrada/",
                entradaObject
              )
              .then(() => {
                window.location = "/home";
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  render() {
    return (
      <>
        <tr>
          <td>{this.props.obj.proveedorCliente}</td>
          <td>{this.props.obj.cantidad}</td>
          <td>{this.props.obj.nombreProducto}</td>
          <td>{this.props.obj.lab}</td>
          <td>
            <Button
              onClick={() => this.setState({ showV: true })}
              size="sm"
              className="me-2"
              variant="success"
            >
              Vender
            </Button>
            <Button
              onClick={() => this.setState({ showC: true })}
              size="sm"
              className="me"
              variant="warning"
            >
              Comprar
            </Button>
          </td>
        </tr>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showV}
          onHide={() => this.setState({ showV: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Vender</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="cantidadV" className="mb-4">
              <Form.Label>
                {'Unidades de "' + this.props.obj.nombreProducto + '" a vender'}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                value={this.state.cantidadV}
                onChange={this.onChangeCantidadV}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showV: false })}
            >
              Cancelar
            </Button>
            <Button variant="success" onClick={this.venta}>
              Hecho
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showC}
          onHide={() => this.setState({ showC: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Entrada</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="cantidadC" className="mb-4">
              <Form.Label>
                {'Unidades de "' +
                  this.props.obj.nombreProducto +
                  '" a comprar'}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                value={this.state.cantidadC}
                onChange={this.onChangeCantidadC}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showC: false })}
            >
              Cerrar
            </Button>
            <Button variant="primary" onClick={this.compra}>
              Hecho
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
