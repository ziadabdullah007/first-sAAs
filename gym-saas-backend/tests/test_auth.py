import pytest

from fastapi import status
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Authentication Tests
@pytest.mark.parametrize('test_enrollment', [
    ('valid'),
    ('email_already_exists'),
    ('missing_password'),
    ('invalid_email_format')
])
def test_enrollment_tts(test_enrollment):
    if test_enrollment == 'valid':
        payload = {
            'first_name': 'Joy',
            'last_name': 'Eze',
            'email': 'joye@fascosoft.com',
            'phone': '+234-80-222-345',
            'password': 'DePYc8%'}
        response = client.post('/api/v1/auth/register', json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'location' in response.headers

    elif test_enrollment == 'email_already_exists':
        payload = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe@example.com',
            'phone': '+44 20 1234 5678',
            'password': 'P@ssw0rd'} 
        response = client.post('/api/v1/auth/register', json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        response = client.post('/api/v1/auth/register', json=payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email already exists' in response.json()['detail']

    elif test_enrollment == 'missing_password':
        payload = {
            'first_name': 'Wolverine',
            'last_name': 'Xavier',
            'email': 'wologerine@fascosoft.com',
            'phone': '+234-80-222-345',
            'password': ''}
        response = client.post('/api/v1/auth/register', json=payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    elif test_enrollment == 'invalid_email_format':
        payload = {
            'first_name': 'Professor',
            'last_name': 'X',
            'email': 'invalid-email',
            'phone': '+234-20-222-345',
            'password': 'x89y7z'}
        response = client.post('/api/v1/auth/register', json=payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

# Login Tests
@pytest.mark.parametrize('test_enrollment', [
    ('valid'),
    ('invalid_credentials')
])
def test_login_platform_tts(test_enrollment):
    if test_enrollment == 'valid':
        login_payload = {
            'email': 'Wally@fascosoft.com',
            'password': 'Wa1ler35el838'}
        login_res = client.post('/api/v1/auth/login', json=login_payload)
        response = client.get('/api/v1/auth/me')
        assert response.status_code == status.HTTP_200_OK

    elif test_enrollment == 'invalid_credentials':
        login_payload = {
            'email': 'invalidsam@example.com',
            'password': 'wrongpass123'}
        login_res = client.post('/api/v1/auth/login', json=login_payload)
        assert login_res.status_code == status.HTTP_401_UNAUTHORIZED
        assert login_res.json()['detail'] == 'Incorrect password or email'

# Mocked User Test
@pytest.mark.parametrize('test_client_session', [
    'gym_admin',
    'staff',
    'super_admin',
    'non_authenticated'
])
def test_protected_routes(client_session):
    if client_session == 'gym_admin':
        login_data = {
            'email': 'dere@fascosoft.com',
            'password': 'Cuba593%'
        }
        login_res = client.post('/api/v1/auth/login', json=login_data)
        assert login_res.status_code == status.HTTP_200_OK
        response = client.get('/api/v1/members')
        assert response.status_code == status.HTTP_200_OK

    elif client_session == 'staff':
        login_data = {
            'email': 'cate@fantasydemo.io',
            'password': 'Change@123'}
        login_res = client.post('/api/v1/auth/login', json=login_data)
        assert login_res.status_code == status.HTTP_200_OK
        response = client.get('/api/v1/members')
        assert response.status_code != 403

    elif client_session == 'super_admin':
        login_data = {
            'email': 'ownership@example.com',
            'password': 'Si#38Pitch'}
        login_res = client.post('/api/v1/auth/login', json=login_data)
        assert login_res.status_code == status.HTTP_200_OK
        response = client.get('/api/v1/members')
        assert response.status_code != 403

    elif client_session == 'non_authenticated':
        response = client.get('/api/v1/members')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED