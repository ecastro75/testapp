import React, {useEffect, useState} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowResult = () =>{

	const token = 'itNqxcG3g25SWW3JOphQXhp89PHZI0Jw'; // Reemplaza esto con tu token real
	//const url = 'http://localhost/api-products-main/';
	const url = 'http://localhost/schoolportal-service/test/index';
	const [results, setResultsAll] = useState([]);
	/*const [id, setId] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');*/
	const [resulid, setResultid] = useState('');
	/*const [producto, setTestName] = useState('');
	const [description, setDescripcion] = useState('');
	const [precio, setPrecio] = useState('');*/
	const [testname, setTestName] = useState('');
	const [partnumber, setPartNumber] = useState('');
	const [serialno, setSerialNo] = useState('');
	const [datetime, setDateTime] = useState('');
	const [duration, setDuration] = useState('');
	/*const [defaults, setDefaults] = useState('');
	const [resultsc, setResultsc] = useState('');*/
	const [operation, setOperation] = useState(1);
	const [title, setTitle] = useState('');

	useEffect( ()=>{
		getResults();
	}, []);

	const getResults = async () => {
		try {
		  	const config = {
		    	headers: { Authorization: `Bearer ${token}`}
		  	};
			const respuesta = await axios.get(url, config);
			setResultsAll(respuesta.data.httpResponse.items);

		} catch (error) {
	    	console.error(error);
	  	}
	}
	
	const openModal = (op, resulid, testname, partnumber, serialno, datetime)=>{
		setResultid('');
		setPartNumber('');
		setSerialNo('');
		setDateTime('');
		setTestName('');
		setOperation(op);
		if(op ===1){
			setTitle('Registrar Producto');
		}else if(op===2){
			setTitle('Editar Producto');
			setResultid(resulid);
			setPartNumber(partnumber);
			setSerialNo(serialno);
			setDateTime(datetime);
			setTestName(testname);
		}
		window.setTimeout(function(){
			document.getElementById('testname').focus();
		},500);
	}
	
	const validar = () => {
		var parametros;
		var metodo;
		var urlAction = '';
		var scenario='update';
		if(testname.trim() === ''){
			show_alerta('Escribe el nombre ', 'warning');
		}else if(serialno.trim() === ''){
			show_alerta('Escribe el serial ', 'warning');
		}else if(partnumber === ''){
			show_alerta('Escribe un numero de parte', 'warning');
		}else if(datetime.trim() === ''){
			show_alerta('una fecha', 'warning');
		}else{
			//show_alerta(partnumber);
			if(operation === 1 ){
				urlAction= 'http://localhost/schoolportal-service/test/create';
				parametros= {"test": {testid: 1, testname:testname.trim(), serialno:serialno.trim(), partnumber:partnumber, datetime:datetime.trim() }};
				metodo = 'POST';
			}else{	
				urlAction= 'http://localhost/schoolportal-service/test/update';
				parametros= {"test": {resulid:resulid, testid:1, testname:testname.trim(), serialno:serialno.trim(), partnumber:partnumber, datetime:datetime.trim()}};
				metodo = 'PUT';
			}
			enviarSolicitud(metodo, parametros, urlAction);
		}
	}
	
	const enviarSolicitud = async(metodo, parametros, url) => {
		console.log(parametros);
		const token = 'itNqxcG3g25SWW3JOphQXhp89PHZI0Jw';
	  	const config = {
	    	headers: { Authorization: `Bearer ${token}`},
	    	data:parametros
	  	};
		await axios( {method:metodo, url:url, ...config} ).then(function(respuestaApi){
			var tipo = respuestaApi.data.httpSuccess;
			var msj = respuestaApi.data.httpResponse.message;//data[1];
			//show_alerta(parametros);
			//console.log('tipo: '+tipo);
			//console.log('msj: '+msj);
			console.log('respuesta : '+respuestaApi.data.httpResponse.message);
			show_alerta(msj, 'success');
			if(tipo){
				document.getElementById('close').click();
				getResults();
			}			
		})
		.catch(function(error){
			show_alerta('Erorr en la solicitud', 'error');
			console.log('error'+error);
		});
	}
	
	const deleteProduct = (id)=>{
		const MySwal = withReactContent(swal);
		var datosEliminar = {id:id};
		var met = 'POST';
		var urlDe= 'http://localhost/schoolportal-service/test/delete';
		MySwal.fire({
			title:"¿Seguro de eliminar el item "+ id +" ?",
			icon:"question",  text:"No podra revertir",
			showCancelButton:true, confirmButtonText:"Sí, eliminar", cancelButtonText:"Cancelar"
		}).then((respuestaApi) =>{
			if(respuestaApi.isConfirmed){
				setResultid(resulid);
				//show_alerta(datosEliminar);
				enviarSolicitud(met, datosEliminar , urlDe);
			}else{
				show_alerta('El producto no fue eliminado', 'info');
			}
		}); 
	}

	return (
		<div className='App'>
			<div className='container-fluid'>
				<div className='row mt-3'>
					<div className='col-md-4 offset-4'>
						<div className='d-grid mx-auto'>
							<button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalResults'>
								<i className='fa-solid fa-circle-plus'></i>Añadir
							</button>
						</div>
					</div>
				</div>
				
				<div className='row mt-3'>
					<div className='col-md-4 offset-4'>
						<div className='table-responsive'>
							<table className='table table-bordered'>
								<thead>
									<tr><td>#</td><td>Name Test</td><td># Part</td><td># Serie </td><td>fecha</td><td>Accion</td></tr>
								</thead>
								<tbody className='table-group-divider'>
									{ 
										results.map( (result, i )=>(
										<tr key={result.resulid}>
											<td>{(i+1)}</td>
											<td>{result.testname}</td>
											<td>{result.partnumber}</td>
											<td>{result.serialno}</td>
											<td>{result.datetime}</td>
											<td>
												<button onClick={() => openModal(2, result.resulid, result.testname, result.partnumber, result.serialno, result.datetime) } className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalResults'>
													<i className='fa-solid fa-edit'></i> 
												</button>&nbsp;
												<button onClick={()=> deleteProduct(result.resulid)} className='btn btn-danger'>
													<i className='fa-solid fa-trash'></i> 
												</button>
											</td>
										</tr>
										))
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				
			</div>
			<div id='modalResults' className='modal fade' haria-hidden='true'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<label className='h5'>{title}</label>
							<button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
						</div>
						<div className='modal-body'>
							<input type='hidden' id='id'></input>
							<div className='input-group mb-3'>
								<span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
								<input type='text' id='testname' className='form-control' placeholder='Nombre' value={testname} onChange={(e)=> setTestName(e.target.value)}></input>
							</div>
							<div className='input-group mb-3'>
								<span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
								<input type='text' id='serialno' className='form-control' placeholder='Serie' value={serialno} onChange={(e)=> setSerialNo(e.target.value)}></input>
							</div>
							<div className='input-group mb-3'><i className='fa-solid fa-doc'></i>
								<input type='text' id='partnumber' className='form-control' placeholder='Parte' value={partnumber} onChange={(e)=> setPartNumber(e.target.value)}></input>
								<span className='input-group-text'></span>
							</div>
							<div className='input-group mb-3'>
								<span className='input-group-text'><i className='fa-solid fa-bill'></i></span>
								<input type='text' id='precio' className='form-control' placeholder='Fecha' value={datetime} onChange={(e)=> setDateTime(e.target.value)}></input>
							</div>	
							
							<div className='d-grid col-6 mx-auto'>
								<button  onClick={()=>validar()} className='btn btn-success'>
								 <i className='fa-solid fa-floppy-disk'></i>Guardar
								</button> 
							</div>							
						</div>
						<div className='modal-footer'>
							<button type='button' id='close' className='btn btn-secundary' data-bs-dismiss='modal'>Cerrar</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ShowResult