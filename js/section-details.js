/**
 * section-details.js
 * ASPICE PRM — Section Details Page
 *
 * Reads ?section=MAN.3 from the URL, looks up PRM_DATA + PRM_DOCUMENTS,
 * and renders the full details page without any modal or page reload.
 *
 * Drop this file at:  /js/section-details.js
 * Pair with:          /section-details.html
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     1. DATA — identical source-of-truth as script.js PRM_DATA
  ═══════════════════════════════════════════════════════════ */
  var PRM_DATA = {
    'SUP.1':  { title:'Quality Assurance', group:'Supporting Process Group', color:'#2e7d32',
      purpose:'Ensure work products and processes comply with predefined provisions; resolve and prevent non-compliances.',
      outcomes:['QA strategy is developed and maintained','Process and product compliance is verified','Non-conformities are identified and tracked','Quality records are maintained','Process improvements are recommended'] },
    'SUP.8':  { title:'Configuration Management', group:'Supporting Process Group', color:'#2e7d32',
      purpose:'Establish and maintain the integrity of all work products and make them available to concerned parties.',
      outcomes:['Configuration items are identified and baselined','Changes are controlled and tracked','Configuration status is recorded and reported','Configuration audits are performed','Releases are managed systematically'] },
    'SUP.9':  { title:'Problem Resolution Management', group:'Supporting Process Group', color:'#2e7d32',
      purpose:'Ensure that problems are identified, analyzed, managed and controlled to resolution.',
      outcomes:['Problems are recorded and classified','Root cause analysis is performed','Corrective actions are defined and tracked','Problem trends are analyzed','Lessons learned are documented'] },
    'SUP.10': { title:'Change Request Management', group:'Supporting Process Group', color:'#2e7d32',
      purpose:'Ensure that change requests are managed, tracked, implemented, and verified throughout the lifecycle.',
      outcomes:['Change requests are recorded and classified','Impact analysis is performed','CRs are approved or rejected with rationale','Implementation is tracked and verified','Change history is maintained'] },
    'SUP.11': { title:'ML Data Management', group:'Supporting Process Group', color:'#2e7d32',
      purpose:'Ensure ML data assets are identified, collected, validated, and maintained throughout the ML lifecycle.',
      outcomes:['Data requirements are defined','Collection and labelling processes are established','Data quality and integrity is verified','Data versioning and lineage is maintained','Data governance policies are applied'] },
    'SYS.1':  { title:'Requirements Elicitation', group:'System Engineering Process Group', color:'#1565c0',
      purpose:'Gather, process, and track evolving stakeholder needs and requirements throughout the product lifecycle.',
      outcomes:['Stakeholder requirements are identified','Requirements are documented and agreed','Traceability to stakeholder needs is established','Requirements changes are managed','Agreement with stakeholders is confirmed'] },
    'SYS.2':  { title:'System Requirements Analysis', group:'System Engineering Process Group', color:'#1565c0',
      purpose:'Transform stakeholder requirements into a set of system technical requirements describing what the system needs to do.',
      outcomes:['System requirements are defined and analyzed','Consistency and feasibility are verified','Traceability to stakeholder requirements is established','System requirements are baselined','Requirements changes are tracked'] },
    'SYS.3':  { title:'System Architectural Design', group:'System Engineering Process Group', color:'#1565c0',
      purpose:'Establish a system architectural design and identify which requirements are allocated to which elements.',
      outcomes:['System architecture is defined','Architectural alternatives are evaluated','Requirements are allocated to architecture elements','Architecture is documented and baselined','Interface definitions are established'] },
    'SYS.4':  { title:'System Integration & Verification', group:'System Engineering Process Group', color:'#1565c0',
      purpose:'Integrate system elements and verify that the integrated system satisfies architectural requirements.',
      outcomes:['Integration strategy is defined','System elements are integrated incrementally','Integration tests are executed and recorded','Defects are tracked and resolved','Integration is verified against architecture'] },
    'SYS.5':  { title:'System Verification', group:'System Engineering Process Group', color:'#1565c0',
      purpose:'Confirm by examination and objective evidence that the system satisfies specified system requirements.',
      outcomes:['Verification strategy is defined','System verification is planned and performed','Verification results are recorded and evaluated','Non-conformances are identified and corrected','System verification report is produced'] },
    'VAL.1':  { title:'Validation', group:'Validation Process Group', color:'#4527a0',
      purpose:'Confirm that the system can accomplish its intended use in the target operational environment.',
      outcomes:['Validation strategy is established','Validation environment is prepared','Validation activities are performed','Validation results are evaluated','Validation report is produced and approved'] },
    'MAN.3':  { title:'Project Management', group:'Management Process Group', color:'#4527a0',
      purpose:'Establish and maintain plans that define, execute, and control project activities in accordance with defined objectives.',
      outcomes:['Project scope is defined','Project plans are created and maintained','Resources are allocated and tracked','Project status is monitored and reported','Issues and risks are managed'] },
    'MAN.5':  { title:'Risk Management', group:'Management Process Group', color:'#4527a0',
      purpose:'Identify, analyze, treat, and monitor project risks continuously throughout the project lifecycle.',
      outcomes:['Risk management strategy is defined','Risks are identified and analyzed','Risk treatments are planned and implemented','Risk status is monitored and reported','Risk register is maintained up to date'] },
    'MAN.6':  { title:'Measurement', group:'Management Process Group', color:'#4527a0',
      purpose:'Collect, analyze, and report data relating to process and product performance to support decision making.',
      outcomes:['Measurement needs are identified','Measurement plan is established','Data collection and storage is implemented','Data is analyzed and interpreted','Results are communicated to stakeholders'] },
    'PIM.3':  { title:'Process Improvement', group:'Process Improvement Group', color:'#4527a0',
      purpose:'Continually improve the effectiveness and efficiency of processes used by the organization.',
      outcomes:['Improvement needs are identified','Improvement goals are established','Process changes are defined and piloted','Improvements are deployed organization-wide','Process performance is re-evaluated'] },
    'REU.2':  { title:'Management of Products for Reuse', group:'Reuse Process Group', color:'#4527a0',
      purpose:'Manage reusable products so they can be effectively used by projects within the organization.',
      outcomes:['Reuse strategy is defined','Reusable products are identified and catalogued','Reuse feasibility is evaluated','Reusable assets are maintained and released','Reuse metrics are tracked'] },
    'SWE.1':  { title:'SW Requirements Analysis', group:'Software Engineering Process Group', color:'#e65100',
      purpose:'Establish software requirements from system requirements allocated to software and define interface requirements.',
      outcomes:['SW requirements are derived from system requirements','SW requirements are documented and agreed','Interface requirements are defined','Requirements consistency is verified','SW requirements are baselined'] },
    'SWE.2':  { title:'SW Architectural Design', group:'Software Engineering Process Group', color:'#e65100',
      purpose:'Establish an architectural design for software that identifies software components and their interfaces.',
      outcomes:['SW architecture is defined','Architectural alternatives are evaluated','SW requirements are allocated to components','Interfaces between components are defined','Architecture is documented and reviewed'] },
    'SWE.3':  { title:'SW Detailed Design & Unit Construction', group:'Software Engineering Process Group', color:'#e65100',
      purpose:'Provide an evaluated detailed design for software components and produce software units.',
      outcomes:['Detailed design is created for each component','Design is reviewed and approved','Software units are constructed from design','Unit construction guidelines are followed','Code review is performed on each unit'] },
    'SWE.4':  { title:'Software Unit Verification', group:'Software Engineering Process Group', color:'#e65100',
      purpose:'Verify software units to ensure that they satisfy their requirements and are free of defects.',
      outcomes:['Unit verification strategy is defined','Unit tests are designed and executed','Structural coverage is measured','Defects are identified and corrected','Unit verification results are documented'] },
    'SWE.5':  { title:'SW Component Verification & Integration', group:'Software Engineering Process Group', color:'#e65100',
      purpose:'Integrate software components and verify that the integrated software satisfies architectural requirements.',
      outcomes:['Integration order is planned','Components are integrated incrementally','Integration tests are designed and executed','Interface compliance is verified','Integration results are documented'] },
    'SWE.6':  { title:'Software Verification', group:'Software Engineering Process Group', color:'#e65100',
      purpose:'Confirm that the integrated software satisfies the specified software requirements.',
      outcomes:['SW verification strategy is defined','Verification criteria are established','SW verification tests are executed','Results are evaluated against criteria','SW verification report is produced'] },
    'HWE.1':  { title:'HW Requirements Analysis', group:'Hardware Engineering Process Group', color:'#b71c1c',
      purpose:'Establish hardware requirements from system requirements allocated to hardware.',
      outcomes:['HW requirements are derived','HW interface requirements are defined','Requirements consistency is verified','HW requirements are baselined','Traceability to system requirements is established'] },
    'HWE.2':  { title:'HW Design', group:'Hardware Engineering Process Group', color:'#b71c1c',
      purpose:'Develop a hardware design that satisfies hardware requirements.',
      outcomes:['HW design is developed','Design alternatives are evaluated','Requirements are allocated to design elements','Design is reviewed and approved','Design documentation is maintained'] },
    'HWE.3':  { title:'Verification against HW Design', group:'Hardware Engineering Process Group', color:'#b71c1c',
      purpose:'Confirm by examination and objective evidence that hardware satisfies its design.',
      outcomes:['Verification strategy is defined','Test cases are derived from design','Verification is performed and results recorded','Non-conformances are identified and resolved','Verification report is produced'] },
    'HWE.4':  { title:'Verification against HW Requirements', group:'Hardware Engineering Process Group', color:'#b71c1c',
      purpose:'Confirm by examination and objective evidence that hardware satisfies specified requirements.',
      outcomes:['Test cases are derived from HW requirements','Verification tests are executed','Structural coverage is evaluated','Results are recorded and analyzed','Verification report is approved'] },
    'MLE.1':  { title:'ML Requirements Analysis', group:'ML Engineering Process Group', color:'#e65100',
      purpose:'Establish ML system requirements, define data requirements, and specify model performance criteria.',
      outcomes:['ML requirements are defined','Data requirements are specified','Model performance criteria are established','ML-specific risks are identified','Requirements are agreed with stakeholders'] },
    'MLE.2':  { title:'ML Architecture', group:'ML Engineering Process Group', color:'#e65100',
      purpose:'Design the ML system architecture, define model types, and specify data pipelines and training infrastructure.',
      outcomes:['ML architecture is designed','Model type and approach is selected','Data pipeline architecture is defined','Architecture is reviewed and documented','Training infrastructure is planned'] },
    'MLE.3':  { title:'ML Training', group:'ML Engineering Process Group', color:'#e65100',
      purpose:'Train and evaluate ML models to satisfy defined ML requirements and performance criteria.',
      outcomes:['Training strategy is defined','Models are trained with versioned data','Training experiments are tracked','Model performance is evaluated','Trained model is documented and stored'] },
    'MLE.4':  { title:'ML Model Testing', group:'ML Engineering Process Group', color:'#e65100',
      purpose:'Verify that the trained ML model satisfies ML requirements in the intended operational environment.',
      outcomes:['Model test strategy is defined','Test data is prepared and validated','Model is tested against requirements','Edge cases and failure modes are evaluated','Model test report is produced'] },
    'ACQ.4':  { title:'Supplier Monitoring', group:'Acquisition Process Group', color:'#4527a0',
      purpose:'Track and assess the performance of suppliers against agreed requirements and plans.',
      outcomes:['Supplier performance criteria are defined','Monitoring plan is established','Supplier deliverables are reviewed','Supplier performance is measured and reported','Corrective actions are requested when needed'] },
    'SPL.2':  { title:'Product Release', group:'Supply Process Group', color:'#4527a0',
      purpose:'Control the release of a product to the customer, ensuring all release criteria are satisfied.',
      outcomes:['Release criteria are defined and agreed','Release package is assembled and verified','Release notes are prepared','Customer acceptance is obtained','Product release is documented and archived'] }
  };

  /* ═══════════════════════════════════════════════════════════
     2. DOCUMENT MANIFEST — mirrors PRM_DOCUMENTS in script.js
  ═══════════════════════════════════════════════════════════ */
  var PRM_DOCUMENTS = {
    basePath: '/documents/aspice-prm/',
    global: [],
    processes: {
      'SYS.2': [
        { type:'DOCX', label:'SYS.2 Requirements Management Plan Template', url:'/documents/aspice-prm/SYS/sys2/1700_ProjectName_RMP_1.0_Reviewed.docx', description:'Template for authoring a Requirements Management Plan. Includes sections for requirements elicitation approach, documentation standards, traceability matrix structure, change control process, and stakeholder sign-off records.' },
        { type:'XLSX', label:'SYS.2 Requirements Analysis Report Template', url:'/documents/aspice-prm/SYS/sys2/1501_ProjectName_AnalysisReport_Reviewed.xlsx', description:'Spreadsheet template for capturing system requirements analysis results. Contains sheets for requirement listing, feasibility ratings, consistency checks, review comments, and open issue log.' }
      ],
      'SYS.3': [
        { type:'XLSX', label:'SYS.3 System Architecture Review Checklist Template', url:'/documents/aspice-prm/SYS/sys3/Review_Checklist_System_Architecture.xlsx', description:'Checklist template for conducting formal system architecture design reviews. Covers architectural completeness, requirements allocation, interface definitions, design rationale, and ASPICE SYS.3 compliance criteria.' }
      ],
      'SYS.4': [
        { type:'DOCX', label:'SYS.4 System Integration Verification Measure Template', url:'/documents/aspice-prm/SYS/sys4/0860_ProjectName_Verification_Measure.docx', description:'Template for defining and recording system integration verification measures. Includes sections for test case ID, verification method, pass/fail criteria, test evidence references, and defect linkage.' }
      ],
      'SYS.5': [
        { type:'DOCX', label:'SYS.5 System Verification Measure Template', url:'/documents/aspice-prm/SYS/sys5/0860_ProjectName_Verification_Measure.docx', description:'Template for planning and recording system-level verification activities. Covers verification objectives, test specifications, execution records, deviation handling, and sign-off by responsible engineer.' }
      ],
      'SWE.1': [
        { type:'XLSX', label:'SWE.1 SW Requirements Analysis Report Template', url:'/documents/aspice-prm/SWE/swe1/1501_ProjectName_AnalysisReport_Reviewed.xlsx', description:'Spreadsheet template for SW requirements analysis. Contains sheets for SW requirement ID, derivation from system requirements, interface requirement listing, consistency check results, and baseline approval status.' }
      ],
      'SWE.2': [
        { type:'DOC',  label:'SWE.2 Software Architecture Design Template', url:'/documents/aspice-prm/SWE/swe2/CGVCU_SWE.2_SWArch_Template.doc', description:'Template for documenting the software architectural design. Includes sections for component decomposition, inter-component interfaces, design decisions, requirements allocation table, and architecture review sign-off.' },
        { type:'DOCX', label:'SWE.2 Software Architecture Guideline Template', url:'/documents/aspice-prm/SWE/swe2/Software Architecture Guideline.docx', description:'Organisational guideline template for creating ASPICE-compliant software architecture documents. Covers naming conventions, diagram standards, review process, tool usage, and mandatory content checklist.' }
      ],
      'SWE.3': [
        { type:'DOC', label:'SWE.3 SW Detailed Design & Unit Construction Guideline Template', url:'/documents/aspice-prm/SWE/swe3/Software_Detail_Design_Unit_Construction_Guideline.doc', description:'Template guideline for SW detailed design and unit construction activities. Includes sections for unit design specifications, coding standards reference, peer review checklist, unit test linkage, and construction completion criteria.' }
      ],
      'SWE.4': [
        { type:'DOCX', label:'SWE.4 Software Unit Verification Measure Template', url:'/documents/aspice-prm/SWE/swe4/0860_ProjectName_Verification_Measure.docx', description:'Template for planning and recording software unit verification. Contains unit test case definitions, structural coverage targets, execution log, defect records, and sign-off table for unit verification completion.' }
      ],
      'SWE.5': [
        { type:'DOCX', label:'SWE.5 SW Component Integration Verification Measure Template', url:'/documents/aspice-prm/SWE/swe5/0860_ProjectName_Verification_Measure.docx', description:'Template for documenting SW component integration verification results. Covers integration order plan, interface test cases, regression test scope, integration defect log, and verification completion sign-off.' }
      ],

      'SUP.1': [
        { type:'DOCX', label:'SUP.1 Quality Management Plan Template', url:'/documents/aspice-prm/SUP/sup1/0813_ProjectName_QMP.docx', description:'Template for the project Quality Management Plan. Includes sections for QA objectives, process compliance activities, audit schedule, non-conformance handling procedure, quality records list, and QA reporting structure.' },
        { type:'XLSX', label:'SUP.1 Problem Record Tracking Template', url:'/documents/aspice-prm/SUP/sup1/1307_ProjectName_Problem_Record.xlsx', description:'Spreadsheet template for logging and tracking quality non-conformances. Contains columns for problem ID, detection date, severity, process area, root cause category, corrective action owner, and closure status.' },
        { type:'DOCX', label:'SUP.1 Quality Management Plan v1.0 Template', url:'/documents/aspice-prm/SUP/sup1/ProjectName_Quality_Management_Plan_v1.0.docx', description:'Comprehensive QMP template with detailed sections for quality policy, process compliance approach, audit types and frequency, metrics collection plan, non-conformance escalation path, and management review agenda.' }
      ],
      'SUP.8': [
        { type:'DOCX', label:'SUP.8 Software Configuration Management Plan Template', url:'/documents/aspice-prm/SUP/sup8/0804_ProjectName_SCM.docx', description:'Template for the Software Configuration Management Plan. Covers CI identification scheme, branching and baselining strategy, change control workflow, configuration status accounting, and release packaging procedure.' },
        { type:'DOCX', label:'SUP.8 Configuration Management Plan v1.0 Template', url:'/documents/aspice-prm/SUP/sup8/1603_ProjectName_Configuration_Management_Plan_1.0.docx', description:'Detailed CM plan template with sections for CM roles and responsibilities, CI type registry, version numbering convention, audit schedule, tool configuration, and CM metrics reporting.' },
        { type:'PPTX', label:'SUP.8 Baseline Strategy Presentation Template', url:'/documents/aspice-prm/SUP/sup8/Baseline Strategy.pptx', description:'Slide deck template for presenting the project baseline strategy to stakeholders. Covers baseline types (functional, allocated, product), baseline triggers, approval workflow, and deviation management approach.' }
      ],
      'SUP.9': [
        { type:'DOCX', label:'SUP.9 Problem Resolution Plan Template', url:'/documents/aspice-prm/SUP/sup9/0827_ProjectName_Problem_Resolution_Plan.docx', description:'Template for the Problem Resolution Management Plan. Includes problem classification criteria, resolution workflow steps, escalation thresholds, RCA methodology selection, corrective action tracking, and KPI definitions.' },
        { type:'XLSX', label:'SUP.9 A3 Problem Solving Template', url:'/documents/aspice-prm/SUP/sup9/ProjectName_A3_Problem_Solving_Doc.xlsx', description:'A3-format spreadsheet template for structured problem solving. Contains sections for problem statement, current state, target state, root cause analysis, countermeasures, implementation plan, and results verification.' },
        { type:'DOCX', label:'SUP.9 Fishbone (Ishikawa) Analysis Template', url:'/documents/aspice-prm/SUP/sup9/TE-10300_Fishbone_Analysis 3.docx', description:'Cause-and-effect diagram template for root cause analysis. Pre-structured with the 6M fishbone categories (Man, Machine, Method, Material, Measurement, Environment) and a linked corrective action summary table.' }
      ],
      'SUP.10': [
        { type:'DOCX', label:'SUP.10 Change Management Plan Template', url:'/documents/aspice-prm/SUP/sup10/0828_ProjectName_Change_Management_Plan_Reviewed.docx', description:'Template for the Change Request Management Plan. Covers CR submission process, impact analysis workflow, classification criteria, approval authority matrix, implementation tracking, and verification of change closure.' },
        { type:'XLSX', label:'SUP.10 Change Request Tracking Sheet Template', url:'/documents/aspice-prm/SUP/sup10/1316_ProjectName_Change_Request.xlsx', description:'Spreadsheet template for logging and tracking all change requests. Contains columns for CR ID, submission date, requestor, priority, impact area, approval status, implementation owner, and verification evidence link.' }
      ],
      'MAN.3': [
        { type:'DOCX', label:'MAN.3 Project Management Plan Template', url:'/documents/aspice-prm/MAN/man3/0812_ProjectName_Project_Management_Plan_v1.0.docx', description:'Template for the Project Management Plan. Includes sections for project scope statement, WBS structure, schedule baselines, resource allocation table, effort estimation, risk summary, and project governance approach.' },
        { type:'DOCX', label:'MAN.3 Communication Management Plan Template', url:'/documents/aspice-prm/MAN/man3/0800_ProjectName_Communication_Management_Plan.docx', description:'Template for the project Communication Management Plan. Includes sections for stakeholder communication needs, reporting channels and frequency, escalation paths, meeting cadence, and document distribution matrix.' },
        { type:'DOCX', label:'MAN.3 Requirements Management Plan Template', url:'/documents/aspice-prm/MAN/man3/1700_ProjectName_RMP.docx', description:'Template for the Requirements Management Plan at project level. Covers requirements elicitation approach, traceability strategy, baseline and change control process, and stakeholder review/approval workflow.' },
        { type:'DOCX', label:'MAN.3 Procurement Management Plan Template', url:'/documents/aspice-prm/MAN/man3/ProjectName_Procurement_Management_Plan.docx', description:'Template for the Procurement Management Plan. Includes sections for supplier selection criteria, contract types, purchase approval workflow, vendor performance tracking, and procurement risk considerations.' },
        { type:'XLSX', label:'MAN.3 Team Skill Matrix Template', url:'/documents/aspice-prm/MAN/man3/ProjectName_Skill_Matrix_Reviewed.xlsx', description:'Spreadsheet template for tracking team skills against project role requirements. Contains skill domains, individual proficiency levels, training needs column, planned training dates, and manager review sign-off.' },
        { type:'XLSX', label:'MAN.3 Technical Feasibility Checklist Template', url:'/documents/aspice-prm/MAN/man3/Technical_Feasibility_Checklists.xlsx', description:'Spreadsheet template for assessing technical feasibility at project initiation. Contains checklist items for technology readiness, resource availability, architectural risk, dependency analysis, and feasibility sign-off.' },
        { type:'XLSX', label:'MAN.3 Lesson Learned Template', url:'/documents/aspice-prm/MAN/man3/1307_ProjectName_Lesson_Learned_Reviewed.xlsx', description:'Spreadsheet template for capturing project lessons learned, including issues encountered, root causes, corrective actions, best practices, and recommendations for future project improvements.' },
        { type:'XLSX', label:'MAN.3 Project Task Tracker Template', url:'/documents/aspice-prm/MAN/man3/Project Task Tracker.xlsx', description:'Spreadsheet template for tracking project tasks day to day. Contains columns for task ID, owner, planned/actual dates, status, dependencies, blockers, and percentage completion.' }
      ],
      'MAN.5': [
        { type:'DOCX', label:'MAN.5 Risk & Issue Management Plan Template', url:'/documents/aspice-prm/MAN/man5/0819_ProjectName_Risk&Issue_Management_Plan.docx', description:'Template for the Risk and Issue Management Plan. Covers risk identification sources, likelihood/impact scoring matrix, risk treatment options, issue escalation criteria, owner assignment, and review cadence.' },
        { type:'XLSX', label:'MAN.5 Risk Register Template', url:'/documents/aspice-prm/MAN/man5/1408_ProjectName_Risk_Register.xls', description:'Spreadsheet template for maintaining the project risk register. Contains columns for risk ID, description, category, probability score, impact score, risk level, mitigation action, owner, status, and residual risk rating.' },
        { type:'DOC', label:'MAN.5 Risk Management Plan Template', url:'/documents/aspice-prm/MAN/man5/0819_Risk_Management_Plan_Template.doc', description:'Template for the Risk Management Plan. Covers risk identification sources, likelihood/impact scoring matrix, risk treatment options, issue escalation criteria, owner assignment, and review cadence.' },
        { type:'DOCX', label:'MAN.5 Corrective Action Report (CAR) Template', url:'/documents/aspice-prm/MAN/man5/1402_ProjectName_CAR.docx', description:'Template for recording a Corrective Action Report. Includes sections for problem description, root cause analysis, corrective action plan, responsible owner, target closure date, and effectiveness verification.' }
      ],
      'MAN.6': [
        { type:'XLSX', label:'MAN.6 Measurement & CSAT Feedback Template', url:'/documents/aspice-prm/MAN/man6/ProjectName_CSAT_Feedback.xlsx', description:'Spreadsheet template for project measurement and customer satisfaction tracking. Includes sheets for KPI definitions, monthly measurement data entry, trend charts, CSAT survey results aggregation, and management reporting summary.' }
      ],
      'PIM.3': [
        { type:'DOCX', label:'PIM.3 Continual Process Improvement Policy Template', url:'/documents/aspice-prm/PIM/pim3/Continual Improvement Policy.docx', description:'Template for the organisational process improvement policy. Includes sections for improvement goal setting, process gap analysis method, improvement proposal format, pilot plan structure, deployment checklist, and effectiveness review criteria.' }
      ]
    }
  };

  /* ═══════════════════════════════════════════════════════════
     3. UTILITY FUNCTIONS
  ═══════════════════════════════════════════════════════════ */

  /** File types that cannot render inline — must be force-downloaded */
  var FORCE_DOWNLOAD_TYPES = ['DOCX','DOC','XLSX','XLS','PPTX','PPT','ZIP','RAR','7Z'];

  function mustForceDownload(type) {
    return FORCE_DOWNLOAD_TYPES.indexOf(String(type || '').toUpperCase()) !== -1;
  }

  function getDocType(doc) {
    if (doc.type) return String(doc.type).toUpperCase();
    var ext = (doc.url || '').split('.').pop();
    return ext ? ext.toUpperCase() : 'DOC';
  }

  function getBadgeClass(type) {
    var t = String(type || '').toUpperCase();
    if (t === 'XLS' || t === 'XLSX') return 'sd-doc-badge--xls';
    if (t === 'PPT' || t === 'PPTX') return 'sd-doc-badge--ppt';
    if (t === 'DOC' || t === 'DOCX') return 'sd-doc-badge--doc';
    if (t === 'HTML' || t === 'HTM') return 'sd-doc-badge--html';
    return 'sd-doc-badge--pdf';
  }

  /** Return display-friendly type label (max 4 chars) */
  function typeLabel(type) {
    var t = String(type || '').toUpperCase();
    if (t === 'DOCX') return 'DOC';
    if (t === 'PPTX') return 'PPT';
    if (t === 'XLSX') return 'XLS';
    return t.substring(0, 4);
  }

  function filenameFromUrl(url) {
    return decodeURIComponent((url || '').split('/').pop()) || 'document';
  }

  function resolveUrl(doc) {
    var path = doc.url || doc.file || '';
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path) || path.charAt(0) === '/') return path;
    return PRM_DOCUMENTS.basePath + path;
  }

  /** Read ?section= from current URL */
  function getSectionId() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('section') || '').trim().toUpperCase();
  }

  /* ═══════════════════════════════════════════════════════════
     4. BUILD DOM HELPERS
  ═══════════════════════════════════════════════════════════ */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(k) {
        if (k === 'className') { node.className = attrs[k]; }
        else if (k === 'textContent') { node.textContent = attrs[k]; }
        else if (k === 'innerHTML') { node.innerHTML = attrs[k]; }
        else { node.setAttribute(k, attrs[k]); }
      });
    }
    (children || []).forEach(function(c) { if (c) node.appendChild(c); });
    return node;
  }

  function buildSectionCard(iconClass, iconColor, label, bodyFn) {
    var icon  = el('div', { className: 'sd-card__hdr-icon ' + iconColor }, [
      el('i', { className: iconClass })
    ]);
    var lbl   = el('div', { className: 'sd-card__label', textContent: label });
    var hdr   = el('div', { className: 'sd-card__hdr' }, [icon, lbl]);
    var body  = el('div', { className: 'sd-card__body' });
    bodyFn(body);
    return el('div', { className: 'sd-card' }, [hdr, body]);
  }

  function buildPurposeCard(purpose) {
    return buildSectionCard('fas fa-bullseye', 'sd-card__hdr-icon--teal', 'Process Purpose', function(body) {
      body.appendChild(el('p', { className: 'sd-purpose', textContent: purpose }));
    });
  }

  function buildOutcomesCard(outcomes) {
    return buildSectionCard('fas fa-list-check', 'sd-card__hdr-icon--navy', 'Key Outcomes', function(body) {
      var ul = el('ul', { className: 'sd-outcomes' });
      (outcomes || []).forEach(function(o) {
        ul.appendChild(el('li', { textContent: o }));
      });
      body.appendChild(ul);
    });
  }

  function buildDocButton(label, href, isDownload, filename) {
    var a = el('a', {
      className : 'sd-doc-btn ' + (isDownload ? 'sd-doc-btn--dl' : 'sd-doc-btn--view'),
      href      : href,
      textContent: isDownload ? 'Download' : '\u2197 View'
    });
    if (isDownload) {
      a.setAttribute('download', filename || 'document');
    } else {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
    return a;
  }

  function buildDocCard(doc) {
    var type     = getDocType(doc);
    var url      = resolveUrl(doc);
    var filename = filenameFromUrl(url);
    var isForce  = mustForceDownload(type);

    var badge = el('div', { className: 'sd-doc-badge ' + getBadgeClass(type), textContent: typeLabel(type) });

    var label = el('div', { className: 'sd-doc-label', textContent: doc.label || doc.title || filename });
    var desc  = doc.description
      ? el('div', { className: 'sd-doc-desc', textContent: doc.description })
      : null;
    var fname = el('span', { className: 'sd-doc-filename', textContent: filename });

    var actions = el('div', { className: 'sd-doc-actions' });

    if (url) {
      if (!isForce) {
        // viewable in browser — offer both View and Download
        actions.appendChild(buildDocButton('View', url, false, filename));
        var dlLink = el('a', {
          className: 'sd-doc-btn sd-doc-btn--dl',
          href: url,
          download: filename,
          textContent: 'Download'
        });
        actions.appendChild(dlLink);
      } else {
        // must download — single Download button
        actions.appendChild(buildDocButton('Download', url, true, filename));
      }
    } else {
      actions.appendChild(el('span', {
        className: 'sd-doc-btn',
        style: 'background:#e2e8f0;color:#8a9bb0;cursor:default;',
        textContent: 'Not available'
      }));
    }

    var info = el('div', { className: 'sd-doc-info' }, [label, desc, fname, actions]);
    return el('div', { className: 'sd-doc-card' }, [badge, info]);
  }

  function buildDocumentsCard(sectionId) {
    return buildSectionCard('fas fa-folder-open', 'sd-card__hdr-icon--green', 'Available Documents', function(body) {
      var global  = PRM_DOCUMENTS.global || [];
      var local   = (PRM_DOCUMENTS.processes || {})[sectionId] || [];
      var docs    = global.concat(local);

      if (docs.length === 0) {
        var empty = el('div', { className: 'sd-docs-empty' });
        empty.appendChild(el('i', { className: 'fas fa-folder-open' }));
        empty.appendChild(el('p', { textContent: 'TBD - To Be Discussed.' }));
        body.appendChild(empty);
        return;
      }

      var grid = el('div', { className: 'sd-docs-grid' });
      docs.forEach(function(doc) { grid.appendChild(buildDocCard(doc)); });
      body.appendChild(grid);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     5. PAGE RENDER
  ═══════════════════════════════════════════════════════════ */

  function renderNotFound(id) {
    document.getElementById('sd-hero-title').textContent = 'Section Not Found';
    document.getElementById('sd-hero-badge').textContent = id || '?';
    document.getElementById('sd-hero-group').textContent = '';
    document.title = 'ASPICE PRM – Not Found | IAST Quality Portal';

    var content = document.getElementById('sd-content');
    var wrap    = el('div', { className: 'sd-not-found' });
    wrap.appendChild(el('h2', { textContent: 'Section "' + (id || '') + '" not found' }));
    wrap.appendChild(el('p',  { textContent: 'The ASPICE PRM section you requested does not exist or has not been configured yet.' }));
    var back = el('a', {
      href      : '/#prm',
      className : 'btn-primary',
      textContent: '\u2190 Back to ASPICE PRM'
    });
    wrap.appendChild(back);
    content.appendChild(el('div', { className: 'sd-card' }, [wrap]));
  }

  function renderSection(id, data) {
    /* ── Hero ── */
    var badge = document.getElementById('sd-hero-badge');
    badge.textContent   = id;
    badge.style.background = data.color || '#00aabb';

    document.getElementById('sd-hero-title').textContent = data.title || id;
    document.getElementById('sd-hero-group').textContent = data.group || '';
    document.title = id + ' – ' + (data.title || '') + ' | IAST Quality Portal';

    /* ── Content cards ── */
    var content = document.getElementById('sd-content');
    content.innerHTML = '';
    content.appendChild(buildPurposeCard(data.purpose));
    content.appendChild(buildOutcomesCard(data.outcomes));
    content.appendChild(buildDocumentsCard(id));
  }

  /* ═══════════════════════════════════════════════════════════
     6. INIT
  ═══════════════════════════════════════════════════════════ */

  function init() {
    var id   = getSectionId();
    var data = id ? PRM_DATA[id] : null;

    if (!id || !data) {
      renderNotFound(id);
    } else {
      renderSection(id, data);
    }
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();