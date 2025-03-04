myApp.controller('createOrEditEstimateCtrl', function ($scope, createOrEditEstimateService, $uibModal) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;



    // *************************** default functions begin here  ********************** //
    //- to get all views of createOrEdit estimate screen dynamically 
    $scope.getEstimateView = function (getViewName, getLevelName, subAssemblyId, partId) {
        createOrEditEstimateService.estimateView(getViewName, function (data) {
            $scope.estimateView = data;
        });
        createOrEditEstimateService.estimateViewData(getViewName, getLevelName, subAssemblyId, partId, function (data) {
            $scope.level = getLevelName;
            $scope.estimateViewData = data;            
        });
    }
    //- get data to generate tree structure dynamically i.e. get assembly stucture
    $scope.getEstimateData = function () {
        createOrEditEstimateService.getEstimateData(function (data) {
            $scope.estimteData = data.assembly;
        });
    }



    // *************************** functions to be triggered form view begin here ***** //
    //- to edit assembly name
    //Edit Assembly Name modal start
    $scope.editAssemblyNameModal = function (assembly) {
        $scope.formData= assembly;
        
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/editAssemblyName.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.editAssemblyName = function (obj) {
        $scope.getEstimateData();
        $scope.cancelModal();    
    }


    //- to add or edit subAssembly data
    $scope.addOrEditSubAssemblyModal = function (operation, subAssembly) {
        createOrEditEstimateService.getAllSubAssModalData(operation, subAssembly, function (data) {

            $scope.formData = data.subAssObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditSubAssemblyName.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    $scope.addSubAssembly = function (subAssemblyData) {
    
        createOrEditEstimateService.createSubAssembly(subAssemblyData, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    $scope.editSubAssembly = function (number) {
        $scope.getEstimateData();
        $scope.cancelModal();
    }
    //- modal to confirm subssembly deletion
    $scope.deleteSubAssemblyModal = function (subAssemblyId, getFunction) {
        $scope.idToDelete = subAssemblyId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
          animation: true,   
          templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
          scope: $scope,
          size: 'md'
        });
    }
    $scope.deleteSubAssembly = function (subAssemblyId) {
        createOrEditEstimateService.deleteSubAssembly(subAssemblyId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('assembly');
            $scope.cancelModal();
        });
    }

    //- to add or edit part name
    $scope.addOrEditPartModal = function (operation, subAssId, part) {
        createOrEditEstimateService.getAllPartModalData(operation, subAssId, part, function (data) {

            $scope.formData = data.partObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.subAssId = data.subAssId;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditPartName.html',
                scope: $scope,
                size: 'md',
            });

        });
    }
    $scope.addPart = function (partData, subAssId) {
        createOrEditEstimateService.createPart(partData, subAssId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    $scope.editPart = function () {
        $scope.getEstimateData();
        $scope.cancelModal();

    }
    //- to add or edit part detail
    $scope.editPartItemDetails = function (subAssemblyId, partId) {
        $scope.getEstimateView('estimatePartItemDetail');
    }
    //- modal to confirm part deletion
    $scope.deletePartModal = function (subAssemblyId, partId) {
        $scope.idToDelete = partId;
        $scope.subAssemblyId =subAssemblyId;

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/deletePartModal.html',
          scope: $scope,
          size: 'md'
        });
    }
    $scope.deletePart = function (subAssemblyId, partId) {  
        createOrEditEstimateService.deletePart(subAssemblyId, partId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('subAssembly');            
            $scope.cancelModal();
        });
    }

    //- to add Proccessing at assembly or subssembly or at partLevel
    $scope.addProcessing = function (processingData, level, subAssemblyId, partId) {
        createOrEditEstimateService.createProcessing(processingData, level, subAssemblyId, partId, function () {
            
            $scope.getEstimateView('processing', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }
        //- to edit Proccessing at assembly or subssembly or at partLevel
    $scope.editProcessing = function () { 
        $scope.getEstimateData();
        $scope.cancelModal();
    }
    //- function to confirm delete Processings
    $scope.deleteProcessing = function (processingId, level, subAssemblyId, partId) {
        createOrEditEstimateService.deleteProcessing(processingId, level, subAssemblyId, partId, function (data) {            
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('processing', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }

    //- to add Addon at assembly or subssembly or at partLevel
    $scope.addAddon = function (addonData, level, subAssemblyId, partId) {
        createOrEditEstimateService.createAddon(addonData, level, subAssemblyId, partId, function () {  
            $scope.getEstimateView('addons', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }
        //- to edit Addon at assembly or subssembly or at partLevel
    $scope.editAddon = function () { 
            $scope.getEstimateData();
            $scope.cancelModal();
    }
        //- function to confirm delete Addons
    $scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {        
        createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('addons', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }


    //- to add Extra at assembly or subssembly or at partLevel
    $scope.addExtra = function (extraData, level, subAssemblyId, partId) {
        createOrEditEstimateService.createExtra(extraData, level, subAssemblyId, partId, function () {            
            $scope.getEstimateView('extras', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }
        //- to edit Extra at assembly or subssembly or at partLevel
    $scope.editExtra = function () { 
        $scope.getEstimateData();
        $scope.cancelModal();
    }
    //- function to confirm delete Extras
    $scope.deleteExtra = function (extraId, level, subAssemblyId, partId) {
        createOrEditEstimateService.deleteExtra(extraId, level, subAssemblyId, partId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('extras', level, subAssemblyId, partId);
            $scope.cancelModal();
        });    
    }


    //- to add or edit custom material 
    $scope.addOrEditCustomMaterialModal = function (operation, customMaterial) {
        createOrEditEstimateService.getCustomMaterialModalData(operation, customMaterial, function (data) {

            $scope.formData = data.custMaterialObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditCustomMaterial.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    //- modal to confirm delete custome materialss 
    $scope.deleteCustomMaterialModal = function (customMaterialId, getFunction) {
        $scope.idToDelete = customMaterialId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
          animation: true,   
          templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
          scope: $scope,
          size: 'md'
        });
    }
    //- function to confirm delete CustomMterial
    $scope.deleteCustomMaterial = function () {
    }


    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }


    // commmon add modal for processing, addons & extras    
    $scope.addItemModal = function (itemType, level, subAssemblyId, partId) {            
        $scope.formData = undefined;            
        $scope.showSaveBtn = true;
        $scope.showEditBtn = false;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEdit' + itemType + '.html',
            scope: $scope,
            size: 'md',
        });
    }
    // commmon edit modal for processing, addons & extras
    $scope.editItemModal = function (itemType, extraObj) {            
        $scope.formData = extraObj;
        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEdit' + itemType + '.html',
            scope: $scope,
            size: 'md',
        });
    }
    // commmon delete modal for processing, addons & extras
    $scope.deleteItemModal = function (getFunction, itemId, level, subAssemblyId, partId) {
        $scope.idToDelete = itemId;
        $scope.functionToCall = getFunction;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/deleteItemModal.html',
          scope: $scope,
          size: 'md'
        });
    }


    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get default view
        $scope.getEstimateView('assembly');
        //to get estimate tree structure data 
        $scope.getEstimateData();
    }

    $scope.init();



    //custom material 
    $scope.customMaterial = [{
            "id": "1",
            "baseMaterial": {
                "thickness": "kishori",
                "grade": "1",
            },
            "hardfacing": {
                "thickness": "20",
                "depositeGrade": "A"
            },
            "customization": "1",
            "price": {
                "kg": "67",
                "m": "98",
            },
            "efficiency": "45",
        },
        {
            "id": "1",
            "baseMaterial": {
                "thickness": "kishori",
                "grade": "1",
            },
            "hardfacing": {
                "thickness": "20",
                "depositeGrade": "A"
            },
            "customization": "1",
            "price": {
                "kg": "67",
                "m": "98",
            },
            "efficiency": "45",
        }
    ]


    //Import SubAssembly
    $scope.importSubAssemblyModal = function () {
        $scope.subAssId;        
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/importSubAssembly.html',
            scope: $scope,
            size: 'md',
        });
    };
    $scope.importSubAssembly = function (subAssId) {
        createOrEditEstimateService.getSubAssemblyData(subAssId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();   
        });            
    };
    //Import Part
    $scope.importPartModal = function () {
        $scope.partId;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/importPart.html',
            scope: $scope,
            size: 'md',
        });
    };
    $scope.importPart = function (partId) {
        createOrEditEstimateService.getPartData(partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();   
        });
    };

    //Common Import Item Modal for Processing, Addons & Extras
    $scope.importItemModal = function (type, level, subAssemblyId, partId) {
        $scope.itemId;
        $scope.level=level;
        $scope.subAssemblyId= subAssemblyId;
        $scope.partId=partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/import' + type + '.html',
            scope: $scope,
            size: 'md',
        });
    };

    //Import Processing
    $scope.importProcessing = function (processingId, level, subAssemblyId, partId) {
        console.log('**** level, subAssemblyId, partId ****', level, subAssemblyId, partId);
        
       createOrEditEstimateService.getProcessingData(processingId, level, subAssemblyId, partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();   
        });
    };

    //Import Addon
    $scope.importAddon = function (addonId, level, subAssemblyId, partId) {
        createOrEditEstimateService.getAddonData(addonId, level, subAssemblyId, partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();   
        });
    };

    //Import Extra
    $scope.importExtra = function (extraId, level, subAssemblyId, partId) {
       createOrEditEstimateService.getExtraData(extraId, level, subAssemblyId, partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();   
        });
    };



});