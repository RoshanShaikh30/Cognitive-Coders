-- =========================================================================
-- ATTENDSPHERE AI: PRODUCTION SUPABASE & POSTGRESQL SCHEMA
-- Multi-Organization Smart Attendance & Analytics Platform
-- Theme: Sakura Intelligence
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema (for fresh migrations)
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS smart_alerts CASCADE;
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 1. ORGANIZATIONS (Multi-Tenant Partition Master)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Japan',
    logo_text VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('University', 'School', 'Institute', 'College')),
    tier VARCHAR(50) DEFAULT 'Enterprise',
    student_count INT DEFAULT 0,
    faculty_count INT DEFAULT 0,
    active_classes INT DEFAULT 0,
    average_attendance NUMERIC(5,2) DEFAULT 85.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    founded INT,
    brand_accent VARCHAR(20) DEFAULT '#f4a7b9',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS (Profiles tied to Supabase Auth & Role-Based Access)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('super_admin', 'org_admin', 'faculty', 'student', 'parent')),
    department VARCHAR(100),
    title VARCHAR(100),
    avatar_url TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CLASSES (Cohorts per organization)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    advisor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_students INT DEFAULT 0,
    average_attendance NUMERIC(5,2) DEFAULT 80.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SUBJECTS (Academic courses)
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_lectures_held INT DEFAULT 0,
    minimum_required NUMERIC(5,2) DEFAULT 75.00,
    credits INT DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STUDENTS (Learner enrollment with biometric facial credentials)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    student_id_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar TEXT,
    overall_attendance NUMERIC(5,2) DEFAULT 100.00,
    total_lectures INT DEFAULT 0,
    attended_lectures INT DEFAULT 0,
    consecutive_absences INT DEFAULT 0,
    is_at_risk BOOLEAN DEFAULT FALSE,
    biometric_registered BOOLEAN DEFAULT FALSE,
    biometric_face_hash TEXT,
    guardian_name VARCHAR(255),
    guardian_email VARCHAR(255),
    guardian_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ATTENDANCE RECORDS (Immutable audit log of each attendance verification)
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    method VARCHAR(50) DEFAULT 'manual' CHECK (method IN ('manual', 'biometric_face', 'qr_code', 'beacon')),
    confidence_score NUMERIC(5,3) DEFAULT 1.000,
    audit_hash TEXT,
    marked_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SMART ALERTS (Automated warning dispatch system)
CREATE TABLE smart_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recipient_role VARCHAR(30) DEFAULT 'all',
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('critical_risk', 'consecutive_absence', 'improvement', 'parent_notice', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('high', 'medium', 'low')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. AI INSIGHTS (Gemini proactive telemetry synthesis)
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('risk', 'trend', 'achievement', 'pattern')),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    impact TEXT,
    recommendation TEXT,
    confidence NUMERIC(4,2) DEFAULT 0.95,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR STRICT TENANT ISOLATION
-- =========================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- 1. Super Admins can access all records
CREATE POLICY super_admin_all_organizations ON organizations
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- 2. Tenant isolation policies (Only allow rows where organization_id matches authenticated user's organization)
CREATE POLICY tenant_isolation_users ON users
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY tenant_isolation_classes ON classes
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY tenant_isolation_subjects ON subjects
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY tenant_isolation_students ON students
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY tenant_isolation_attendance ON attendance_records
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY tenant_isolation_alerts ON smart_alerts
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY tenant_isolation_insights ON ai_insights
    FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::UUID OR auth.jwt() ->> 'role' = 'super_admin');

-- =========================================================================
-- TRIGGER: RECALCULATE STUDENT ATTENDANCE UPON NEW RECORD INSERTION
-- =========================================================================
CREATE OR REPLACE FUNCTION update_student_attendance_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_total INT;
    v_attended INT;
    v_pct NUMERIC(5,2);
    v_consecutive INT := 0;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'present')
    INTO v_total, v_attended
    FROM attendance_records
    WHERE student_id = NEW.student_id;

    IF v_total > 0 THEN
        v_pct := ROUND((v_attended::NUMERIC / v_total::NUMERIC) * 100, 2);
    ELSE
        v_pct := 100.00;
    END IF;

    -- Update student stats
    UPDATE students
    SET total_lectures = v_total,
        attended_lectures = v_attended,
        overall_attendance = v_pct,
        is_at_risk = (v_pct < 75.00),
        updated_at = NOW()
    WHERE id = NEW.student_id;

    -- If attendance falls below 75%, automatically fire a high-severity smart alert
    IF v_pct < 75.00 THEN
        INSERT INTO smart_alerts (organization_id, recipient_role, student_id, type, title, message, severity)
        VALUES (
            NEW.organization_id,
            'all',
            NEW.student_id,
            'critical_risk',
            'Automated Debarment Risk Triggered',
            'Student attendance dropped to ' || v_pct || '%, falling below the mandatory 75% examination threshold.',
            'high'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_attendance_insert
AFTER INSERT ON attendance_records
FOR EACH ROW EXECUTE FUNCTION update_student_attendance_stats();

-- =========================================================================
-- SEED DATA INITIALIZATION
-- =========================================================================
INSERT INTO organizations (id, name, slug, code, city, country, logo_text, type, average_attendance)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kyoto Imperial Academy of Advanced Tech', 'kyoto-tech', 'KIA-TECH', 'Kyoto', 'Japan', '京都KIA', 'University', 86.40),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Cherry Blossom STEM International Institute', 'hanami-stem', 'CB-STEM', 'Tokyo', 'Japan', '桜花STEM', 'Institute', 89.20),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Osaka Shikon Creative & Business College', 'osaka-shikon', 'OSK-BIZ', 'Osaka', 'Japan', '大阪商科', 'College', 79.50);
