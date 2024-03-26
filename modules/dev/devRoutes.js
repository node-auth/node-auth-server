const express = require('express');
const { encryptSHA256 } = require('../../utils/encryption-util');
const { validateAPIKEY } = require('./devMiddleware');
/** Services */
const permissionService = require('../auth/services/permissionService');
const organizationService = require('../app/services/organizationService');
const apiService = require('../app/services/apiService');
const apiPermissionService = require('../app/services/apiPermissionService');
const applicationService = require('../app/services/applicationService');
const applicationPermissionService = require('../app/services/applicationPermissionService');
const callbackUrlService = require('../app/services/callbackUrlService');
const roleService = require('../auth/services/roleService');
const rolePermissionService = require('../auth/services/rolePermissionService');
const userService = require('../auth/services/userService');
const userRoleService = require('../auth/services/userRoleService');
const userPermissionService = require('../auth/services/userPermissionService');

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
                /** Create application */
                const qApplicationInsert = await applicationService.createApplication(dataToInsert);
                /** Update response */
                responseData['applications'][i]['application_id'] = qApplicationInsert['application_id'];

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }

                /** Create application permissions */
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await applicationPermissionService.createApplicationPermission({
                        application_id: qApplicationInsert['application_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }

                /** Create application callback urls */
                for(let j = 0; j < calbackUrlsData.length; j++) {
                    await callbackUrlService.createCallbackUrl({
                        url: calbackUrlsData[j]['url'],
                        application_id: qApplicationInsert['application_id'],
                        is_default: calbackUrlsData[j]['is_default']
                    })
                }
            } else {
                /** data for insert */
                const dataToUpdate = JSON.parse(JSON.stringify(applicationData[i]));
                const permissionsData = JSON.parse(JSON.stringify(applicationData[i]['permissions']));
                const calbackUrlsData = JSON.parse(JSON.stringify(applicationData[i]['callback_urls']));
                /** remove unnecessary data */
                delete dataToUpdate['application_code'];
                delete dataToUpdate['permissions'];
                delete dataToUpdate['callback_urls'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToUpdate['organization_id']);
                dataToUpdate['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Create application */
                const qApplicationUpdate = await applicationService.updateApplication(dataToUpdate);
                /** Update response */
                responseData['applications'][i]['application_id'] = dataToUpdate['application_id'];

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }

                /** Create application permissions */
                await applicationPermissionService.deleteApplicationPermissionByApplicationId(dataToUpdate['application_id']);
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await applicationPermissionService.createApplicationPermission({
                        application_id: dataToUpdate['application_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }

                /** Create application callback urls */
                await callbackUrlService.deleteCallbackUrlsByApplicationId(dataToUpdate['application_id']);
                for(let j = 0; j < calbackUrlsData.length; j++) {
                    await callbackUrlService.createCallbackUrl({
                        url: calbackUrlsData[j]['url'],
                        application_id: dataToUpdate['application_id'],
                        is_default: calbackUrlsData[j]['is_default']
                    })
                }
            }
        }

        /** Roles */
        const roleData = req.body['roles'];
        for(let i = 0; i < roleData.length; i++) {
            if(roleData[i]['role_id'] == 0) {
                /** data for insert */
                const dataToInsert = JSON.parse(JSON.stringify(roleData[i]));
                const permissionsData = JSON.parse(JSON.stringify(roleData[i]['permissions']));
                /** remove unnecessary data */
                delete dataToInsert['role_id'];
                delete dataToInsert['role_code'];
                delete dataToInsert['permissions'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToInsert['organization_id']);
                dataToInsert['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Create role */
                const qRoleInsert = await roleService.createRole(dataToInsert);
                /** Update response */
                responseData['roles'][i]['role_id'] = qRoleInsert['role_id'];

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }

                /** Create role permissions */
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await rolePermissionService.createRolePermission({
                        role_id: qRoleInsert['role_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }
            } else {
                /** data for insert */
                const dataToUpdate = JSON.parse(JSON.stringify(roleData[i]));
                const permissionsData = JSON.parse(JSON.stringify(roleData[i]['permissions']));
                /** remove unnecessary data */
                delete dataToUpdate['role_code'];
                delete dataToUpdate['permissions'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToUpdate['organization_id']);
                dataToUpdate['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Update role */
                await roleService.updateRole(dataToUpdate);
                /** Update response */
                responseData['roles'][i]['role_id'] = dataToUpdate['role_id'];

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }

                /** Create role permissions */
                await rolePermissionService.deleteRolePermissionByRoleId(dataToUpdate['role_id']);
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await rolePermissionService.createRolePermission({
                        role_id: dataToUpdate['role_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }
            }
        }

        /** Users */
        const userData = req.body['users'];
        for(let i = 0; i < userData.length; i++) {
            if(userData[i]['user_id'] == 0) {
                /** data for insert */
                const dataToInsert = JSON.parse(JSON.stringify(userData[i]));
                const rolesData = JSON.parse(JSON.stringify(userData[i]['roles']));
                const permissionsData = JSON.parse(JSON.stringify(userData[i]['permissions']));
                /** remove unnecessary data */
                delete dataToInsert['user_id'];
                delete dataToInsert['user_code'];
                delete dataToInsert['roles'];
                delete dataToInsert['permissions'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToInsert['organization_id']);
                dataToInsert['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Create role */
                const qUserInsert = await userService.createUser(dataToInsert);
                /** Update response */
                responseData['users'][i]['user_id'] = qUserInsert['user_id'];

                /** Get roles */
                const roleDataFromJSON = JSON.parse(JSON.stringify(responseData['roles']));

                /** Create user roles */
                for(let j = 0; j < rolesData.length; j++) {
                    const roleIndex = roleDataFromJSON.findIndex(item => item['role_code'] == rolesData[j]);
                    const roleCurrentData = roleDataFromJSON[roleIndex];
                    await userRoleService.createUserRole({
                        user_id: qUserInsert['user_id'],
                        role_id: roleCurrentData['role_id']
                    });
                }

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }

                /** Create user permissions */
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await userPermissionService.createUserPermission({
                        user_id: qUserInsert['user_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }
            } else {
                /** data for update */
                const dataToUpdate = JSON.parse(JSON.stringify(userData[i]));
                const rolesData = JSON.parse(JSON.stringify(userData[i]['roles']));
                const permissionsData = JSON.parse(JSON.stringify(userData[i]['permissions']));
                /** remove unnecessary data */
                delete dataToUpdate['user_code'];
                delete dataToUpdate['roles'];
                delete dataToUpdate['permissions'];
                /** get organization id */
                const orgIndex = responseData['organizations'].findIndex(item => item['organization_code'] == dataToUpdate['organization_id']);
                dataToUpdate['organization_id'] = responseData['organizations'][orgIndex]['organization_id'];
                /** Update role */
                const qUserUpdate = await userService.updateUser(dataToUpdate);
                /** Update response */
                responseData['users'][i]['user_id'] = qUserUpdate['user_id'];

                /** Get roles */
                const roleDataFromJSON = JSON.parse(JSON.stringify(responseData['roles']));

                /** Create user roles */
                await userRoleService.deleteUserRoleByUserId(dataToUpdate['user_id']);
                for(let j = 0; j < rolesData.length; j++) {
                    const roleIndex = roleDataFromJSON.findIndex(item => item['role_code'] == rolesData[j]);
                    const roleCurrentData = roleDataFromJSON[roleIndex];
                    await userRoleService.createUserRole({
                        user_id: dataToUpdate['user_id'],
                        role_id: roleCurrentData['role_id']
                    });
                }

                /** Get api permissions */
                const apiPermissionJSON = JSON.parse(JSON.stringify(responseData['apis']));
                let apiPermissionData = [];
                for(let j = 0; j < apiPermissionJSON.length; j++) {
                    apiPermissionData = [...apiPermissionData, ...apiPermissionJSON[j]['permissions']]
                }

                /** Create user permissions */
                await userPermissionService.deleteUserPermissionByUserId(dataToUpdate['user_id']);
                for(let j = 0; j < permissionsData.length; j++) {
                    const apiPermissionIndex = apiPermissionData.findIndex(item => item['permission_code'] == permissionsData[j]);
                    const apiPermissionCurrentData = apiPermissionData[apiPermissionIndex];
                    await userPermissionService.createUserPermission({
                        user_id: dataToUpdate['user_id'],
                        permission_id: apiPermissionCurrentData['permission_id']
                    });
                }
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