<? PHP      
session_start();

$_SESSION["loggedInUser"] = $username;


    try {
        // open connection to MongoDB server
        $conn = new Mongo('localhost');

        // access database
        $db = $conn->test;

        // access collection
        $collection = $db->items;


        $userName = $_POST['username'];
        $userPass = $_POST['userPassword'];


        $user = $db->$collection->findOne(array('username'=> 'user1', 'password'=> 'pass1'));

        foreach ($user as $obj) {
            echo 'Username' . $obj['username'];
            echo 'password: ' . $obj['password'];
            if($userName == 'user1' && $userPass == 'pass1'){
                echo 'found'            
            }
            else{
                echo 'not found'            
            }

        }

        // disconnect from server
        $conn->close();

    } catch (MongoConnectionException $e) {
        die('Error connecting to MongoDB server');
    } catch (MongoException $e) {
        die('Error: ' . $e->getMessage());
    }

$_SESSION["loggedInUser"] = $correct;

?>

<!DOCTYPE html>
<html lang="en">

	<head>

		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<meta name="description" content="">
		<meta name="author" content="">

		<title>Prosumer Account</title>

		<!-- Custom fonts for this template-->
		<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
		<link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

		<!-- Custom styles for this template-->
		<link href="css/sb-admin-2.min.css" rel="stylesheet">

	</head>

	<body id="page-top">

		<!-- Page Wrapper -->
		<div id="wrapper" style="height: 100%;min-height: 100vh;">

			<!-- Content Wrapper -->
			<div id="content-wrapper" class="d-flex flex-column">

				<!-- Main Content -->
				<div id="content">

				    <!-- Topbar -->
				    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			  			<!-- Sidebar - Brand -->
						<a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
							<div class="sidebar-brand-icon">
								<i class="fas fa-bolt"></i>
							</div>
							<div class="sidebar-brand-text mx-3">Prosumer Account</div>
						</a>
						<!-- Topbar Navbar -->
						<ul class="navbar-nav ml-auto">

			        		<div class="topbar-divider d-none d-sm-block"></div>

						        <!-- Nav Item - User Information -->
						        <li class="nav-item dropdown no-arrow">
									<a class="nav-link dropdown-toggle" href="#" data-target="#logoutModal" role="button" data-toggle="modal" aria-haspopup="true" aria-expanded="false">
						            	<i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
						              	Logout
						         	</a>
						        </li>

			      		</ul>

			    	</nav>
			    	<!-- End of Topbar -->

				    <!-- Begin Page Content -->
				    <div class="container-fluid">

						<!-- Page Heading -->
						<div class="d-sm-flex align-items-center justify-content-between mb-4">
							<h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
						</div>

						<!-- Content Row -->
						<div class="row">

							<!-- Current Production -->
							<div class="col-xl-3 col-md-6 mb-4">
								<div class="row">
			        				<div class="col-xl-12 col-md-12 mb-4">
										<div class="card border-left-info shadow py-2">
											<div class="card-body">
												<div class="row no-gutters align-items-center">
													<div class="col mr-2">
														<div class="text-xs font-weight-bold text-info text-uppercase mb-1">Current Production</div>
														<div class="h5 mb-0 font-weight-bold text-gray-800">50 kw/h</div>
													</div>
													<div class="col-auto">
														<i class="fas fa-bolt fa-2x text-gray-300"></i>
													</div>
												</div>
											</div>
										</div>
									</div>
			        				<div class="col-xl-12 col-md-12 mb-4">
										<div class="card border-left-info  shadow">
							                <!-- Card Header - Dropdown -->
							                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						                  		<h6 class="m-0 font-weight-bold text-info">Production Ratio</h6>
						                  		<div class="dropdown no-arrow">
								                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								                      	<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
								                    </a>
								                    <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
								                      	<div class="dropdown-header">Ratio :</div>
								                      	<a class="dropdown-item" href="#" data-target="#editProductionRatio" role="button" data-toggle="modal">Edit</a>
								                    </div>
						                  		</div>
						                	</div>
							                <!-- Card Body -->
							                <div class="card-body">
							                  	<div class="chart-pie pt-4 pb-2"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
							                    	<canvas id="ProductionPieChart" width="447" height="306" class="chartjs-render-monitor" style="display: block; height: 245px; width: 358px;"></canvas>
							                  	</div>
							                  	<div class="mt-4 text-center small">
								                    <span class="mr-2">
								                      	<i class="fas fa-circle text-success"></i> Own Consumption
								                    </span>
								                    <span class="mr-2">
								                      	<i class="fas fa-circle text-warning"></i> Buffer
								                    </span>
								                    <span class="mr-2">
								                      	<i class="fas fa-circle text-danger"></i> Market
								                    </span>
							                  	</div>
							                </div>
						              	</div>
				              		</div>
				          		</div>
							</div>



					        <!-- Current Consumption -->
					        <div class="col-xl-3 col-md-6 mb-4">
								<div class="row">
			        				<div class="col-xl-12 col-md-12 mb-4">
							          	<div class="card border-left-success shadow py-2">
								            <div class="card-body">
								              	<div class="row no-gutters align-items-center">
									                <div class="col mr-2">
									                  	<div class="text-xs font-weight-bold text-success text-uppercase mb-1">Current Consumption</div>
									                  	<div class="h5 mb-0 font-weight-bold text-gray-800">18 kw/h</div>
									                </div>
									                <div class="col-auto">
									                  	<i class="fas fa-charging-station fa-2x text-gray-300"></i>
									                </div>
								              	</div>
								            </div>
							          	</div>
							        </div>

			        				<div class="col-xl-12 col-md-12 mb-4">
							          	<div class="card border-left-success shadow">
							                <!-- Card Header - Dropdown -->
							                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						                  		<h6 class="m-0 font-weight-bold text-success">Consumption Ratio</h6>
						                  		<div class="dropdown no-arrow">
								                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								                      	<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
								                    </a>
								                    <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
								                      	<div class="dropdown-header">Ratio :</div>
								                      	<a class="dropdown-item" href="#" data-target="#editConsumptionRatio" role="button" data-toggle="modal">Edit</a>
								                    </div>
						                  		</div>
						                	</div>
							                <!-- Card Body -->
							                <div class="card-body">
							                  	<div class="chart-pie pt-4 pb-2"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
							                    	<canvas id="ConsumptionPieChart" width="447" height="306" class="chartjs-render-monitor" style="display: block; height: 245px; width: 358px;"></canvas>
							                  	</div>
							                  	<div class="mt-4 text-center small">
								                    <span class="mr-2">
								                      	<i class="fas fa-circle text-info"></i> Own Production
								                    </span>
								                    <span class="mr-2">
								                      	<i class="fas fa-circle text-warning"></i> Buffer
								                    </span>
								                    <span class="mr-2">
								                      	<i class="fas fa-circle text-danger"></i> Market
								                    </span>
							                  	</div>
							                </div>
						              	</div>
						            </div>
						        </div>
					        </div>

					        <div class="col-xl-6 col-lg-5 col-md-6">

								<div class="row">

					        		<!-- Net Production -->
			        				<div class="col-xl-6 col-md-6 mb-4">
								        <div class="card border-left-primary shadow py-2">
								            <div class="card-body">
								              	<div class="row no-gutters align-items-center">
									                <div class="col mr-2">
									                  	<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Net Production</div>
									                  	<div class="row no-gutters align-items-center">
									                    	<div class="col-auto">
									                      		<div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">32 kw/h</div>
									                    	</div>
									                  	</div>
									                </div>
									                <div class="col-auto">
									                  	<i class="fas fa-bolt fa-2x text-gray-300"></i>
									                </div>
								              	</div>
								            </div>
							          	</div>
							        </div>

					    			<!-- Buffer filling -->
			        				<div class="col-xl-6 col-md-6 mb-4">
							          	<div class="card border-left-warning shadow py-2">
								            <div class="card-body">
								              	<div class="row no-gutters align-items-center">
									                <div class="col mr-2">
									                  	<div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Buffer filling</div>
									                  	<div class="row no-gutters align-items-center">
									                    	<div class="col-auto">
									                      		<div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">50 %</div>
									                    	</div>
									                    	<div class="col">
									                      		<div class="progress progress-sm mr-2">
									                        		<div class="progress-bar bg-warning" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
									                      		</div>
									                    	</div>
									                  	</div>
									                </div>
									                <div class="col-auto">
									                  	<i class="fas fa-battery-three-quarters fa-2x text-gray-300"></i>
									                </div>
								              	</div>
								            </div>
							          	</div>
						          	</div>

						          	<!-- Current Wind -->
							        <div class="col-xl-6 col-md-6 mb-4" style="height: fit-content;">
							          	<div class="card border-left-primary shadow h-100 py-2">
							            	<div class="card-body">
							              		<div class="row no-gutters align-items-center">
							                		<div class="col mr-2">
							                  			<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Current Wind</div>
							                  			<div class="h5 mb-0 font-weight-bold text-gray-800">18 km/h</div>
							                		</div>
							                		<div class="col-auto">
							                  			<i class="fas fa-wind fa-2x text-gray-300"></i>
							                		</div>
							              		</div>
							            	</div>
							          	</div>
		              
							        </div>

							    	<!-- Current Electricity Price -->
							        <div class="col-xl-6 col-md-6 mb-4" style="height: fit-content;">
							          	<div class="card border-left-danger shadow h-100 py-2">
							            	<div class="card-body">
							              		<div class="row no-gutters align-items-center">
							                		<div class="col mr-2">
							                  			<div class="text-xs font-weight-bold text-danger text-uppercase mb-1">Current Electricity Price</div>
							                  			<div class="h5 mb-0 font-weight-bold text-gray-800">1.5 SEK /kwh</div>
							                		</div>
									                <div class="col-auto">
									                  	<i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
									                </div>
							              		</div>
							            	</div>
							          	</div>
							        </div>
					        	</div>

					        	<!-- Picture -->
					          	<div class="card shadow mb-4">
						            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						              	<h6 class="m-0 font-weight-bold text-primary">Your House</h6>
									  	<div class="dropdown no-arrow">
						                	<a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						                  		<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
						                	</a>
						                	<div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
						                  		<div class="dropdown-header">Picture :</div>
						                  		<a class="dropdown-item" href="#" data-target="#editPictureModal" role="button" data-toggle="modal">Edit</a>
						                	</div>
						              	</div>
						            </div>
						            <div class="card-body">
						              	<div class="text-center">
						                	<img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="img/undraw_posting_photo.svg" alt="">
						              	</div>
						            </div>
						        </div>
					        </div>

						<!-- ./End Content Row -->
				      	</div> 

				    </div>
				    <!-- /.container-fluid -->

			  	</div>
			  	<!-- End of Main Content -->

			</div>
			<!-- End of Content Wrapper -->

		</div>
		<!-- End of Page Wrapper -->

		<!-- Scroll to Top Button-->
		<a class="scroll-to-top rounded" href="#page-top">
			<i class="fas fa-angle-up"></i>
		</a>

		<!-- Logout Modal-->
		<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
						<button class="close" type="button" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
					<div class="modal-footer">
						<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
						<a class="btn btn-primary" href="login.html">Logout</a>
					</div>
				</div>
			</div>
		</div>


		<!-- Edit Picture Modal-->
		<div class="modal fade" id="editPictureModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Change your house picture</h5>
						<button class="close" type="button" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
							<div class="custom-file">
							  	<input type="file" class="custom-file-input" id="newPicture">
							  	<label class="custom-file-label" for="newPicture">Choose file</label>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
						<a class="btn btn-primary" href="login.html">Validate</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Consumption Ratio Modal-->
		<div class="modal fade" id="editConsumptionRatio" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Change your consumption atio</h5>
						<button class="close" type="button" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
						  	<div class="form-group row">
							    <label for="consumptonRatioBuffer" class="col-sm-4 col-form-label"><i class="fas fa-circle text-warning"></i>  Buffer (%)</label>
							    <div class="col-sm-8">
							      	<input type="number" class="form-control" id="consumptionRatioBuffer" min="0" max="100" >
							    </div>
						  	</div>
						  	<div class="form-group row">
							    <label for="consumptonRatioMarket" class="col-sm-4 col-form-label"><i class="fas fa-circle text-danger"></i>  Market (%)</label>
							    <div class="col-sm-8">
							      	<input type="number" class="form-control" id="consumptionRatioMarket" min="0" max="100" >
							    </div>
						  	</div>
						</form>
					</div>
					<div class="modal-footer">
						<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
						<a class="btn btn-primary" href="login.html">Validate</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Production Ratio Modal-->
		<div class="modal fade" id="editProductionRatio" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Change your production ratio</h5>
						<button class="close" type="button" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
						  	<div class="form-group row">
							    <label for="consumptonRatioBuffer" class="col-sm-4 col-form-label"><i class="fas fa-circle text-warning"></i>  Buffer (%)</label>
							    <div class="col-sm-8">
							      	<input type="number" class="form-control" id="productionRatioBuffer" min="0" max="100" >
							    </div>
						  	</div>
						  	<div class="form-group row">
							    <label for="consumptonRatioMarket" class="col-sm-4 col-form-label"><i class="fas fa-circle text-danger"></i>  Market (%)</label>
							    <div class="col-sm-8">
							      	<input type="number" class="form-control" id="productionRatioMarket" min="0" max="100" >
							    </div>
						  	</div>
						</form>
					</div>
					<div class="modal-footer">
						<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
						<a class="btn btn-primary" href="login.html">Validate</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Bootstrap core JavaScript-->
		<script src="vendor/jquery/jquery.min.js"></script>
		<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

		<!-- Core plugin JavaScript-->
		<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

		<!-- Custom scripts for all pages-->
		<script src="js/sb-admin-2.min.js"></script>

		<!-- Page level plugins -->
		<script src="vendor/chart.js/Chart.min.js"></script>

		<!-- Page level custom scripts -->
		<script src="js/demo/chart-area-demo.js"></script>
		<script src="js/demo/chart-pie-demo.js"></script>

	</body>

</html>
