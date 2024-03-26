const express = require('express');
const { encryptSHA256 } = require('../../utils/encryptions/encrypt');
const { validateAPIKEY } = require('./devMiddleware');
/** Services */
const permissionService = require('../auth/services/permissionService');
const organizationService = require('../app/services/organizationService');
const apiService = require('../app/services/apiService');
const apiPermissionService = require('../app/services/apiPermissionService');
const applicationService = require('../app/services/applicationService');
const applicationPermissionService = require('../app/services/applicationPermissionService');


const router = express.Router();

/** Encrypt sha256 */
router.post('/encrypt/sha256', validateAPIKEY, (req, res) => {
    const text = req.body.text;
    const encrypted = encryptSHA256(text);
    res.send(encrypted);
});

/** Create api */
router.post('/createOrUpdateAPI', validateAPIKEY, async (req, res) => {
    try {
        let responseData = JSON.parse(JSON.stringify(req.body));

        /** Organizations */
        const orgData = req.body['organizations'];
        for(let i = 0; i < orgData.length; i++) {
            if(orgData[i]['organization_id'] == 0) {
                const dataToInsert = JSON.parse(JSON.stringify(orgData[i]));
                delete dataToInsert['organization_id'];
                delete dataToInsert['organization_code'];
                const qOrgInsert = await organizationService.createOrganization(dataToInsert);
                /** Update response */
                responseData['organizations'][i]['organization_id'] = qOrgInsert['organization_id'];
            } else {
                delete orgData[i]['organization_code'];
                await organizationService.updateOrganization(orgData[i]);
            }
        }
    
        /** Api */
        const apiData = req.body['apis'];
        for(let i = 0; i < apiData.length; i++) {
            if(apiData[i]['api_id'] == 0) {
                /** data for insert */
                const dataToInsert = JSON.parse(JSON.stringify(apiData[i]));
                const permissionsToData = JSON.parse(JSON.stringify(apiData[i]['permissions']));
                /** remove unnecessary data */
                delete dataToInsert['api_id'];
                delete dataToInsert['api_code'];
                delete dataToInsert['permissions'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToInsert['organization_id']);
                dataToInsert['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Create api */
                const qApiInsert = await apiService.createApi(dataToInsert);
                /** Update response */
                responseData['apis'][i]['api_id'] = qApiInsert['api_id'];
                /** Create or update permission */
                for(let j = 0; j < permissionsToData.length; j++) {
                    const permissionToInsert = JSON.parse(JSON.stringify(permissionsToData[j]));
                    if(permissionToInsert['permission_id'] == 0) {
                        delete permissionToInsert['permission_id'];
                        delete permissionToInsert['permission_code'];
                        const qPermissionInsert = await permissionService.createPermission(permissionToInsert);
                        responseData['apis'][i]['permissions'][j]['permission_id'] = qPermissionInsert['permission_id'];
                        /** Create api permission if do not exist */
                        const qApiPermission = await apiPermissionService.getPermissionApiIdAndPermissionId(qApiInsert['api_id'], qPermissionInsert['permission_id']);
                        if(!qApiPermission) {
                            await apiPermissionService.createApiPermission({
                                api_id: qApiInsert['api_id'],
                                permission_id: qPermissionInsert['permission_id']
                            });
                        }
                    } else {
                        delete permissionToInsert['permission_code'];
                        await permissionService.updatePermission(permissionToInsert);
                        /** Create api permission if do not exist */
                        const qApiPermission = await apiPermissionService.getPermissionApiIdAndPermissionId(responseData['apis'][i]['api_id'], permissionToInsert['permission_id']);
                        if(!qApiPermission) {
                            await apiPermissionService.createApiPermission({
                                api_id: responseData['apis'][i]['api_id'],
                                permission_id: permissionToInsert['permission_id']
                            });
                        }
                    }
                }
            } else {
                /** data for update */
                const dataToUpdate = JSON.parse(JSON.stringify(apiData[i]));
                const permissionsToData = JSON.parse(JSON.stringify(apiData[i]['permissions']));
                /** remove unnecessary data */
                delete dataToUpdate['api_code'];
                delete dataToUpdate['permissions'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToUpdate['organization_id']);
                dataToUpdate['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** update api */
                await apiService.updateApi(dataToUpdate);
                /** create or update permission */
                for(let j = 0; j < permissionsToData.length; j++) {
                    const permissionToInsert = JSON.parse(JSON.stringify(permissionsToData[j]));
                    if(permissionToInsert['permission_id'] == 0) {
                        delete permissionToInsert['permission_id'];
                        delete permissionToInsert['permission_code'];
                        const qPermissionInsert = await permissionService.createPermission(permissionToInsert);
                        responseData['apis'][i]['permissions'][j]['permission_id'] = qPermissionInsert['permission_id'];
                        /** Create api permission if do not exist */
                        const qApiPermission = await apiPermissionService.getPermissionApiIdAndPermissionId(dataToUpdate['api_id'], qPermissionInsert['permission_id']);
                        if(!qApiPermission) {
                            await apiPermissionService.createApiPermission({
                                api_id: dataToUpdate['api_id'],
                                permission_id: qPermissionInsert['permission_id']
                            });
                        }
                    } else {
                        delete permissionToInsert['permission_code'];
                        await permissionService.updatePermission(permissionToInsert);
                        /** Create api permission if do not exist */
                        const qApiPermission = await apiPermissionService.getPermissionApiIdAndPermissionId(dataToUpdate['api_id'], permissionToInsert['permission_id']);
                        if(!qApiPermission) {
                            await apiPermissionService.createApiPermission({
                                api_id: dataToUpdate['api_id'],
                                permission_id: permissionToInsert['permission_id']
                            });
                        }
                    }
                }
            }
        }

        /** Applications */
        const applicationData = req.body['applications'];
        for(let i = 0; i < applicationData.length; i++) {
            if(applicationData[i]['application_id'] == 0) {
                /** data for insert */
                const dataToInsert = JSON.parse(JSON.stringify(applicationData[i]));
                const permissionsData = JSON.parse(JSON.stringify(applicationData[i]['permissions']));
                const calbackUrlsData = JSON.parse(JSON.stringify(applicationData[i]['callback_urls']));
                /** remove unnecessary data */
                delete dataToInsert['application_id'];
                delete dataToInsert['application_code'];
                delete dataToInsert['permissions'];
                delete dataToInsert['callback_urls'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToInsert['organization_id']);
                dataToInsert['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Create api */
                const qApplicationInsert = await applicationService.createApplication(dataToInsert);
                /** Update response */
                responseData['applications'][i]['application_id'] = qApplicationInsert['application_id'];

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }
                /** Create permissions */
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await applicationPermissionService.createApplicationPermission({
                        application_id: qApplicationInsert['application_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }
                /** Create callback urls */
                for(let j = 0; j < calbackUrlsData.length; j++) {
                    
                }
            } else {

            }
        }
        
        /** Response */
        res.send(responseData);
    } catch(err) {
        console.log(err);
        res.send("ERROR");
    }
});

module.exports = router;