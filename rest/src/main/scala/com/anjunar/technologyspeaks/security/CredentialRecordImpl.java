package com.anjunar.technologyspeaks.security;

import com.webauthn4j.credential.CredentialRecord;
import com.webauthn4j.data.AuthenticatorTransport;
import com.webauthn4j.data.attestation.AttestationObject;
import com.webauthn4j.data.attestation.authenticator.AttestedCredentialData;
import com.webauthn4j.data.client.CollectedClientData;

import java.util.Set;

public class CredentialRecordImpl implements CredentialRecord {
    private final String credentialId;
    private final AttestationObject attestationObject;
    private final CollectedClientData clientData;
    private final Set<AuthenticatorTransport> transports;
    private long counter;
    private boolean uvInitialized;
    private boolean backupEligible;
    private boolean backedUp;

    public CredentialRecordImpl(
            String credentialId,
            AttestationObject attestationObject,
            CollectedClientData clientData,
            Set<AuthenticatorTransport> transports,
            long counter
    ) {
        this.credentialId = credentialId;
        this.attestationObject = attestationObject;
        this.clientData = clientData;
        this.transports = transports;
        this.counter = counter;
        this.uvInitialized = false; 
        this.backupEligible = false;
        this.backedUp = false;      
    }

    public AttestationObject getAttestationObject() {
        return attestationObject;
    }

    @Override
    public CollectedClientData getClientData() {
        return clientData;
    }

    @Override
    public Boolean isUvInitialized() {
        return uvInitialized;
    }

    @Override
    public void setUvInitialized(boolean value) {
        this.uvInitialized = value;
    }

    @Override
    public Boolean isBackupEligible() {
        return backupEligible;
    }

    @Override
    public void setBackupEligible(boolean value) {
        this.backupEligible = value;
    }

    @Override
    public Boolean isBackedUp() {
        return backedUp;
    }

    @Override
    public void setBackedUp(boolean value) {
        this.backedUp = value;
    }

    @Override
    public AttestedCredentialData getAttestedCredentialData() {
        AttestedCredentialData attestedCredentialData = attestationObject.getAuthenticatorData().getAttestedCredentialData();
        if (attestedCredentialData == null) {
            throw new IllegalStateException("AttestedCredentialData is missing in AttestationObject");
        }
        return attestedCredentialData;
    }

    @Override
    public long getCounter() {
        return counter;
    }

    @Override
    public void setCounter(long value) {
        this.counter = value;
    }

    @Override
    public Set<AuthenticatorTransport> getTransports() {
        return transports;
    }

    public String getCredentialId() {
        return credentialId;
    }
}