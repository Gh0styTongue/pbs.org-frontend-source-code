export const SSO_METRICS = {
  LOGIN_ATTEMPT:                    'SSO Login Attempted',
  LOGIN_ATTEMPT_WITH_ACTIVATION:    'SSO Login Attempt with Activation',
  LOGIN_FAILED:                     'SSO Login Failed',
  LOGIN_JTI_ALREADY_USED:           'SSO Login with Already used JTI',
  USER_CANCELLED_LOGIN:             'SSO User Cancelled Login Request',
  INVALID_GRANT:                    'SSO Invalid Grant',
  NO_PROFILE_FOR_TOKEN:             'SSO Profile Service Returned No Profile',

  // Login success is different from completed
  // Completed verifies that the user is headed to their final redirection page
  // after possibly going through the VPPA flow. Not just having valid tokens.
  LOGIN_SUCCESS:                    'SSO Login Successful',
  LOGIN_COMPLETED:                  'SSO Login Completed',

  LOGOUT_ATTEMPT:                   'SSO Logout Attempted',
  LOGOUT_SUCCESS:                   'SSO Logout Succeeded',
  PROFILE_TOKEN_FORCED_LOGOUT:      'SSO Session Profile Not Refreshable',

  PROFILE_LINK_REDIRECT:            'Sending User To Profile Page',
  REGISTER_ATTEMPT:                 'SSO Registration Attempted',
  REGISTER_ATTEMPT_WITH_ACTIVATION: 'SSO Registration Attempt with Activation',
}

export const PASSPORT_ACTIVATION_METRICS = {
  NAMESPACE:                        'passport:activation',
  ATTEMPT:                          'Attempt',
  FAILURE_ACTIVATION_FAILED:        'Failure - activation failed error',
  FAILURE_DATA_MISSING:             'Failure - activated data missing',
  FAILURE_MEMBERSHIP_ACTIVE:        'Failure - membership already active',
  FAILURE_MEMBERSHIP_CHECK:         'Failure - membership check error',
  FAILURE_MISSING_MEMBERSHIP_ID:    'Failure - missing membership id error',
  FAILURE_MISSING_USER_DATA:        'Failure - missing user data error',
  FAILURE_MISSING_USER_DATA_STATION_ID:    'Failure - missing user data error: station id',
  FAILURE_MISSING_USER_DATA_MEMBERSHIP_PK: 'Failure - missing user data error: membership pk',
  FAILURE_MISSING_USER_DATA_CALLSIGN:      'Failure - missing user data error: callsign',
  FAILURE_MISSING_USER_DATA_SIGNEDINEMAIL: 'Failure - missing user data error: signed in email',
  FAILURE_NO_PROFILE:               'Failure - no profile error',
  SUCCESS:                          'Success!',
}

export const REPORT_A_PROBLEM_METRICS = {
  NAMESPACE:                        'video:report_a_problem',
  PROBLEM_SUBMITTED:                'Video Problem Submitted',
}

export const DEVICE_ACTIVATION_METRICS = {
  NAMESPACE:                        'device:activation',
  ATTEMPT:                          'Attempt',
  FAILURE_ACTIVATION_ERROR:         'Failure - device activation error',
  FAILURE_CODE_ERROR:               'Failure - code error',
  FAILURE_CODE_EXPIRED:             'Failure - code expired',
  SUCCESS:                          'Success!',
}

export const PASSPORT_TRANSFER_METRICS = {
  NAMESPACE:                        'passport:transfer',
  ATTEMPT:                          'Attempt',
  FAILURE_ACTIVATION_FAILED:        'Failure - transfer activation failed error',
  FAILURE_DATA_MISSING:             'Failure - transfer data missing',
  SUCCESS:                          'Success!',
}

export const LOCALIZATION_VERIFICATION_METRICS = {
  NAMESPACE:                        'localization_verification',
  ATTEMPT:                          'Attempt',
  FAILURE_TOKEN_USED:               'Failure - token is already used',
  FAILURE_ERROR_FROM_API:           'Failure - error from API (such as invalid token)',
  FAILURE_ERROR:                    'Failure - error (something went wrong)',
  SUCCESS_AUTHORIZED:               'Success! User is authorized',
  SUCCESS_UNAUTHORIZED:             'Success! But user is unauthorized',
}
