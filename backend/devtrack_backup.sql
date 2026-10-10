--
-- PostgreSQL database dump
--

\restrict 6gcz91Tew5vz2IwTFj1m5PAKhSoupgHM52bApWI4JAw2JRIwiPvLIXOjim5QXSj

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    user_name character varying(100) NOT NULL,
    action character varying(100) NOT NULL,
    target character varying(200) NOT NULL,
    detail character varying(200),
    type character varying(50) NOT NULL,
    project_name character varying(100),
    workspace_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    task_id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    user_name character varying(100) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    id integer NOT NULL,
    workspace_id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    tasks_count integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_id_seq OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    status character varying(50) NOT NULL,
    progress integer NOT NULL,
    icon character varying(50),
    color character varying(50),
    start_date date,
    deadline date,
    workspace_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    status character varying(50) NOT NULL,
    priority character varying(50) NOT NULL,
    due_date date,
    project_id integer NOT NULL,
    assignee_id character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspaces (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    color character varying(50),
    owner_id character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workspaces OWNER TO postgres;

--
-- Name: workspaces_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workspaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workspaces_id_seq OWNER TO postgres;

--
-- Name: workspaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workspaces_id_seq OWNED BY public.workspaces.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: workspaces id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces ALTER COLUMN id SET DEFAULT nextval('public.workspaces_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, user_id, user_name, action, target, detail, type, project_name, workspace_id, created_at) FROM stdin;
1	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:18:14.637459+05:30
2	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:18:14.908389+05:30
3	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:20:32.043109+05:30
4	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:20:32.260537+05:30
5	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:44:36.206726+05:30
6	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:44:36.350465+05:30
7	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:46:57.631185+05:30
8	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:46:57.789674+05:30
9	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:51:07.600831+05:30
10	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:51:07.723065+05:30
11	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:53:58.441594+05:30
12	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:53:58.580292+05:30
13	user-1	Tanushri	created task	T1	\N	task	Counts Test Proj	1	2026-10-10 23:53:58.965841+05:30
14	user-1	Tanushri	created task	T2	\N	task	Counts Test Proj	1	2026-10-10 23:53:59.00044+05:30
15	user-1	Tanushri	created task	Build Test Feature	\N	task	Pincher	1	2026-10-10 23:53:59.501185+05:30
16	user-1	Tanushri	created task	Kanban Drag Task	\N	task	Pincher	1	2026-10-10 23:53:59.575409+05:30
17	user-1	Tanushri	moved task to in-progress	Kanban Drag Task	\N	status_change	Pincher	1	2026-10-10 23:53:59.600095+05:30
18	user-1	Tanushri	created task	Temp Delete Task	\N	task	Pincher	1	2026-10-10 23:53:59.648145+05:30
19	user-1	Tanushri	deleted task	Temp Delete Task	\N	task	Pincher	1	2026-10-10 23:53:59.672723+05:30
20	user-1	Tanushri	created task	Audit Task	\N	task	Pincher	1	2026-10-10 23:53:59.756703+05:30
21	user-1	Tanushri	moved task to done	Audit Task	\N	status_change	Pincher	1	2026-10-10 23:53:59.781924+05:30
22	user-1	Tanushri	deleted task	Audit Task	\N	task	Pincher	1	2026-10-10 23:53:59.805735+05:30
23	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:54:51.918039+05:30
24	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:54:52.082903+05:30
25	user-1	Tanushri	created task	T1	\N	task	Counts Test Proj	1	2026-10-10 23:54:52.538501+05:30
26	user-1	Tanushri	created task	T2	\N	task	Counts Test Proj	1	2026-10-10 23:54:52.566944+05:30
27	user-1	Tanushri	created task	Build Test Feature	\N	task	Pincher	1	2026-10-10 23:54:52.635764+05:30
28	user-1	Tanushri	created task	Kanban Drag Task	\N	task	Pincher	1	2026-10-10 23:54:52.706938+05:30
29	user-1	Tanushri	moved task to in-progress	Kanban Drag Task	\N	status_change	Pincher	1	2026-10-10 23:54:52.731542+05:30
30	user-1	Tanushri	created task	Temp Delete Task	\N	task	Pincher	1	2026-10-10 23:54:52.782211+05:30
31	user-1	Tanushri	deleted task	Temp Delete Task	\N	task	Pincher	1	2026-10-10 23:54:52.806884+05:30
32	user-1	Tanushri	created task	Audit Task	\N	task	Pincher	1	2026-10-10 23:54:52.899225+05:30
33	user-1	Tanushri	moved task to done	Audit Task	\N	status_change	Pincher	1	2026-10-10 23:54:52.930422+05:30
34	user-1	Tanushri	deleted task	Audit Task	\N	task	Pincher	1	2026-10-10 23:54:52.953119+05:30
35	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-10 23:58:37.868495+05:30
36	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-10 23:58:38.007736+05:30
37	user-1	Tanushri	created task	T1	\N	task	Counts Test Proj	1	2026-10-10 23:58:38.396106+05:30
38	user-1	Tanushri	created task	T2	\N	task	Counts Test Proj	1	2026-10-10 23:58:38.427583+05:30
39	user-1	Tanushri	created task	Build Test Feature	\N	task	Pincher	1	2026-10-10 23:58:38.503455+05:30
40	user-1	Tanushri	created task	Kanban Drag Task	\N	task	Pincher	1	2026-10-10 23:58:38.598552+05:30
41	user-1	Tanushri	moved task to in-progress	Kanban Drag Task	\N	status_change	Pincher	1	2026-10-10 23:58:38.629687+05:30
42	user-1	Tanushri	created task	Temp Delete Task	\N	task	Pincher	1	2026-10-10 23:58:38.687955+05:30
43	user-1	Tanushri	deleted task	Temp Delete Task	\N	task	Pincher	1	2026-10-10 23:58:38.716949+05:30
44	user-1	Tanushri	created task	Audit Task	\N	task	Pincher	1	2026-10-10 23:58:38.815519+05:30
45	user-1	Tanushri	moved task to done	Audit Task	\N	status_change	Pincher	1	2026-10-10 23:58:38.844251+05:30
46	user-1	Tanushri	deleted task	Audit Task	\N	task	Pincher	1	2026-10-10 23:58:38.869023+05:30
47	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-11 00:00:00.121939+05:30
48	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-11 00:00:00.26494+05:30
49	user-1	Tanushri	created task	T1	\N	task	Counts Test Proj	1	2026-10-11 00:00:00.671656+05:30
50	user-1	Tanushri	created task	T2	\N	task	Counts Test Proj	1	2026-10-11 00:00:00.700825+05:30
51	user-1	Tanushri	created task	Task 1	\N	task	Frontend App	31	2026-10-11 00:00:00.913132+05:30
52	user-1	Tanushri	created task	Task 2	\N	task	Frontend App	31	2026-10-11 00:00:00.938677+05:30
53	user-1	Tanushri	created task	Task 3	\N	task	Frontend App	31	2026-10-11 00:00:00.96799+05:30
54	user-1	Tanushri	created task	Task 4	\N	task	Frontend App	31	2026-10-11 00:00:00.997357+05:30
55	user-1	Tanushri	created task	Task 5	\N	task	Frontend App	31	2026-10-11 00:00:01.03002+05:30
56	user-1	Tanushri	created task	Task 6	\N	task	Backend API	31	2026-10-11 00:00:01.060602+05:30
57	user-1	Tanushri	created task	Task 7	\N	task	Backend API	31	2026-10-11 00:00:01.092946+05:30
58	user-1	Tanushri	created task	Task 8	\N	task	Backend API	31	2026-10-11 00:00:01.137146+05:30
59	user-1	Tanushri	created task	Task 9	\N	task	Mobile App	32	2026-10-11 00:00:01.193558+05:30
60	user-1	Tanushri	created task	Task 10	\N	task	Mobile App	32	2026-10-11 00:00:01.21964+05:30
62	user-1	Tanushri	created task	Build Test Feature	\N	task	Pincher	1	2026-10-11 00:00:01.705132+05:30
63	user-1	Tanushri	created task	Kanban Drag Task	\N	task	Pincher	1	2026-10-11 00:00:01.822896+05:30
64	user-1	Tanushri	moved task to in-progress	Kanban Drag Task	\N	status_change	Pincher	1	2026-10-11 00:00:01.856412+05:30
65	user-1	Tanushri	created task	Temp Delete Task	\N	task	Pincher	1	2026-10-11 00:00:01.904926+05:30
66	user-1	Tanushri	deleted task	Temp Delete Task	\N	task	Pincher	1	2026-10-11 00:00:01.927865+05:30
67	user-1	Tanushri	created task	Audit Task	\N	task	Pincher	1	2026-10-11 00:00:02.05329+05:30
68	user-1	Tanushri	moved task to done	Audit Task	\N	status_change	Pincher	1	2026-10-11 00:00:02.079191+05:30
69	user-1	Tanushri	deleted task	Audit Task	\N	task	Pincher	1	2026-10-11 00:00:02.103843+05:30
70	user-1	Tanushri	commented on	Build Test Feature	\N	comment	Pincher	1	2026-10-11 00:02:41.982187+05:30
71	user-1	Tanushri	invited	newmember@example.com	as Member	join	Pincher Development	1	2026-10-11 00:02:42.114662+05:30
72	user-1	Tanushri	created task	T1	\N	task	Counts Test Proj	1	2026-10-11 00:02:42.525547+05:30
73	user-1	Tanushri	created task	T2	\N	task	Counts Test Proj	1	2026-10-11 00:02:42.559564+05:30
74	user-1	Tanushri	created task	Task 1	\N	task	Frontend App	36	2026-10-11 00:02:42.766626+05:30
75	user-1	Tanushri	created task	Task 2	\N	task	Frontend App	36	2026-10-11 00:02:42.790926+05:30
76	user-1	Tanushri	created task	Task 3	\N	task	Frontend App	36	2026-10-11 00:02:42.818506+05:30
77	user-1	Tanushri	created task	Task 4	\N	task	Frontend App	36	2026-10-11 00:02:42.840899+05:30
78	user-1	Tanushri	created task	Task 5	\N	task	Frontend App	36	2026-10-11 00:02:42.865392+05:30
79	user-1	Tanushri	created task	Task 6	\N	task	Backend API	36	2026-10-11 00:02:42.89496+05:30
80	user-1	Tanushri	created task	Task 7	\N	task	Backend API	36	2026-10-11 00:02:42.920786+05:30
81	user-1	Tanushri	created task	Task 8	\N	task	Backend API	36	2026-10-11 00:02:42.941602+05:30
82	user-1	Tanushri	created task	Task 9	\N	task	Mobile App	37	2026-10-11 00:02:42.962219+05:30
83	user-1	Tanushri	created task	Task 10	\N	task	Mobile App	37	2026-10-11 00:02:42.982847+05:30
85	user-1	Tanushri	created task	Build Test Feature	\N	task	Pincher	1	2026-10-11 00:02:43.436502+05:30
86	user-1	Tanushri	created task	Kanban Drag Task	\N	task	Pincher	1	2026-10-11 00:02:43.515565+05:30
87	user-1	Tanushri	moved task to in-progress	Kanban Drag Task	\N	status_change	Pincher	1	2026-10-11 00:02:43.542382+05:30
88	user-1	Tanushri	created task	Temp Delete Task	\N	task	Pincher	1	2026-10-11 00:02:43.601758+05:30
89	user-1	Tanushri	deleted task	Temp Delete Task	\N	task	Pincher	1	2026-10-11 00:02:43.630072+05:30
90	user-1	Tanushri	created task	Audit Task	\N	task	Pincher	1	2026-10-11 00:02:43.724782+05:30
91	user-1	Tanushri	moved task to done	Audit Task	\N	status_change	Pincher	1	2026-10-11 00:02:43.752304+05:30
92	user-1	Tanushri	deleted task	Audit Task	\N	task	Pincher	1	2026-10-11 00:02:43.778019+05:30
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
09737c7104ad
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, task_id, user_id, user_name, content, created_at) FROM stdin;
1	1	user-1	Tanushri	Test integration comment	2026-10-10 23:18:14.637459+05:30
2	1	user-1	Tanushri	Test integration comment	2026-10-10 23:20:32.043109+05:30
3	1	user-1	Tanushri	Test integration comment	2026-10-10 23:44:36.206726+05:30
4	1	user-1	Tanushri	Test integration comment	2026-10-10 23:46:57.631185+05:30
5	1	user-1	Tanushri	Test integration comment	2026-10-10 23:51:07.600831+05:30
6	1	user-1	Tanushri	Test integration comment	2026-10-10 23:53:58.441594+05:30
7	1	user-1	Tanushri	Test integration comment	2026-10-10 23:54:51.918039+05:30
8	1	user-1	Tanushri	Test integration comment	2026-10-10 23:58:37.868495+05:30
9	1	user-1	Tanushri	Test integration comment	2026-10-11 00:00:00.121939+05:30
10	1	user-1	Tanushri	Test integration comment	2026-10-11 00:02:41.982187+05:30
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members (id, workspace_id, user_id, name, email, role, status, tasks_count, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, status, progress, icon, color, start_date, deadline, workspace_id, created_at, updated_at) FROM stdin;
1	Pincher	AI Fashion Recommendation Platform	active	75	👗	#6366f1	\N	\N	1	2026-10-10 22:57:17.491342+05:30	2026-10-10 22:57:17.491342+05:30
2	APIForge	Developer API Testing & Documentation Platform	active	45	🔧	#8b5cf6	\N	\N	2	2026-10-10 22:57:17.491342+05:30	2026-10-10 22:57:17.491342+05:30
3	DevTrack	Project Management Platform	active	60	📋	#4f46e5	\N	\N	2	2026-10-10 22:57:17.491342+05:30	2026-10-10 22:57:17.491342+05:30
4	Portfolio	Personal Developer Portfolio Website	active	90	🌟	#06b6d4	\N	\N	3	2026-10-10 22:57:17.491342+05:30	2026-10-10 22:57:17.491342+05:30
5	Bhasha	Regional Language Translation Engine	completed	100	🗣️	#10b981	\N	\N	2	2026-10-10 22:57:17.491342+05:30	2026-10-10 22:57:17.491342+05:30
6	OSS Toolkit	Open Source Developer Utilities Collection	active	30	🌐	#10b981	\N	\N	4	2026-10-10 22:57:17.491342+05:30	2026-10-10 22:57:17.491342+05:30
8	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 22:57:43.763588+05:30	2026-10-10 22:57:43.763588+05:30
10	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 22:59:04.511915+05:30	2026-10-10 22:59:04.511915+05:30
12	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:10:59.548036+05:30	2026-10-10 23:10:59.548036+05:30
14	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:13:09.019253+05:30	2026-10-10 23:13:09.019253+05:30
16	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:18:15.071479+05:30	2026-10-10 23:18:15.071479+05:30
18	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:20:32.399005+05:30	2026-10-10 23:20:32.399005+05:30
20	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:44:36.543372+05:30	2026-10-10 23:44:36.543372+05:30
22	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:46:57.936976+05:30	2026-10-10 23:46:57.936976+05:30
24	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:51:07.833083+05:30	2026-10-10 23:51:07.833083+05:30
26	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:53:58.712961+05:30	2026-10-10 23:53:58.712961+05:30
28	Counts Test Proj	\N	active	0	📋	#4f46e5	\N	\N	1	2026-10-10 23:53:58.911951+05:30	2026-10-10 23:53:58.911951+05:30
29	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:54:52.217661+05:30	2026-10-10 23:54:52.217661+05:30
32	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-10 23:58:38.149788+05:30	2026-10-10 23:58:38.149788+05:30
35	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-11 00:00:00.416053+05:30	2026-10-11 00:00:00.416053+05:30
38	Frontend App	\N	active	0	📋	#4f46e5	\N	\N	31	2026-10-11 00:00:00.835278+05:30	2026-10-11 00:00:00.835278+05:30
39	Backend API	\N	active	0	📋	#4f46e5	\N	\N	31	2026-10-11 00:00:00.861428+05:30	2026-10-11 00:00:00.861428+05:30
40	Mobile App	\N	planning	0	📋	#4f46e5	\N	\N	32	2026-10-11 00:00:00.885817+05:30	2026-10-11 00:00:00.885817+05:30
42	Integration Test Project	Testing project creation	active	40	🔧	#8b5cf6	\N	\N	1	2026-10-11 00:02:42.261237+05:30	2026-10-11 00:02:42.261237+05:30
45	Frontend App	\N	active	0	📋	#4f46e5	\N	\N	36	2026-10-11 00:02:42.686895+05:30	2026-10-11 00:02:42.686895+05:30
46	Backend API	\N	active	0	📋	#4f46e5	\N	\N	36	2026-10-11 00:02:42.712069+05:30	2026-10-11 00:02:42.712069+05:30
47	Mobile App	\N	planning	0	📋	#4f46e5	\N	\N	37	2026-10-11 00:02:42.738049+05:30	2026-10-11 00:02:42.738049+05:30
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, status, priority, due_date, project_id, assignee_id, created_at, updated_at) FROM stdin;
1	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:10:59.838168+05:30	2026-10-10 23:10:59.838168+05:30
2	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:10:59.930389+05:30	2026-10-10 23:10:59.986286+05:30
4	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:13:09.328134+05:30	2026-10-10 23:13:09.328134+05:30
5	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:13:09.419755+05:30	2026-10-10 23:13:09.481508+05:30
7	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:18:15.281273+05:30	2026-10-10 23:18:15.281273+05:30
8	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:18:15.364863+05:30	2026-10-10 23:18:15.439774+05:30
10	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:20:32.58887+05:30	2026-10-10 23:20:32.58887+05:30
11	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:20:32.669829+05:30	2026-10-10 23:20:32.723762+05:30
13	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:44:36.724454+05:30	2026-10-10 23:44:36.724454+05:30
14	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:44:36.799902+05:30	2026-10-10 23:44:36.843776+05:30
16	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:46:58.113234+05:30	2026-10-10 23:46:58.113234+05:30
17	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:46:58.193057+05:30	2026-10-10 23:46:58.244261+05:30
19	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:51:08.003369+05:30	2026-10-10 23:51:08.003369+05:30
20	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:51:08.209818+05:30	2026-10-10 23:51:08.25607+05:30
22	T1	\N	todo	medium	\N	28	user-1	2026-10-10 23:53:58.965841+05:30	2026-10-10 23:53:58.965841+05:30
23	T2	\N	done	medium	\N	28	user-1	2026-10-10 23:53:59.00044+05:30	2026-10-10 23:53:59.00044+05:30
24	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:53:59.501185+05:30	2026-10-10 23:53:59.501185+05:30
25	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:53:59.575409+05:30	2026-10-10 23:53:59.623889+05:30
30	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:54:52.635764+05:30	2026-10-10 23:54:52.635764+05:30
31	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:54:52.706938+05:30	2026-10-10 23:54:52.756256+05:30
36	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-10 23:58:38.503455+05:30	2026-10-10 23:58:38.503455+05:30
37	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-10 23:58:38.598552+05:30	2026-10-10 23:58:38.658259+05:30
42	Task 1	\N	todo	low	2026-10-13	38	user-1	2026-10-11 00:00:00.913132+05:30	2026-10-11 00:00:00.913132+05:30
43	Task 2	\N	in-progress	medium	2026-10-09	38	user-1	2026-10-11 00:00:00.938677+05:30	2026-10-11 00:00:00.938677+05:30
44	Task 3	\N	in-review	high	2026-10-13	38	user-1	2026-10-11 00:00:00.96799+05:30	2026-10-11 00:00:00.96799+05:30
45	Task 4	\N	done	urgent	2026-10-09	38	user-1	2026-10-11 00:00:00.997357+05:30	2026-10-11 00:00:00.997357+05:30
46	Task 5	\N	done	low	2026-10-13	38	user-1	2026-10-11 00:00:01.03002+05:30	2026-10-11 00:00:01.03002+05:30
47	Task 6	\N	todo	medium	2026-10-09	39	user-1	2026-10-11 00:00:01.060602+05:30	2026-10-11 00:00:01.060602+05:30
48	Task 7	\N	in-progress	high	2026-10-13	39	user-1	2026-10-11 00:00:01.092946+05:30	2026-10-11 00:00:01.092946+05:30
49	Task 8	\N	done	urgent	2026-10-09	39	user-1	2026-10-11 00:00:01.137146+05:30	2026-10-11 00:00:01.137146+05:30
50	Task 9	\N	todo	high	2026-10-13	40	user-1	2026-10-11 00:00:01.193558+05:30	2026-10-11 00:00:01.193558+05:30
51	Task 10	\N	done	low	2026-10-13	40	user-1	2026-10-11 00:00:01.21964+05:30	2026-10-11 00:00:01.21964+05:30
53	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-11 00:00:01.705132+05:30	2026-10-11 00:00:01.705132+05:30
54	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-11 00:00:01.822896+05:30	2026-10-11 00:00:01.881609+05:30
59	Task 1	\N	todo	low	2026-10-13	45	user-1	2026-10-11 00:02:42.766626+05:30	2026-10-11 00:02:42.766626+05:30
60	Task 2	\N	in-progress	medium	2026-10-09	45	user-1	2026-10-11 00:02:42.790926+05:30	2026-10-11 00:02:42.790926+05:30
61	Task 3	\N	in-review	high	2026-10-13	45	user-1	2026-10-11 00:02:42.818506+05:30	2026-10-11 00:02:42.818506+05:30
62	Task 4	\N	done	urgent	2026-10-09	45	user-1	2026-10-11 00:02:42.840899+05:30	2026-10-11 00:02:42.840899+05:30
63	Task 5	\N	done	low	2026-10-13	45	user-1	2026-10-11 00:02:42.865392+05:30	2026-10-11 00:02:42.865392+05:30
64	Task 6	\N	todo	medium	2026-10-09	46	user-1	2026-10-11 00:02:42.89496+05:30	2026-10-11 00:02:42.89496+05:30
65	Task 7	\N	in-progress	high	2026-10-13	46	user-1	2026-10-11 00:02:42.920786+05:30	2026-10-11 00:02:42.920786+05:30
66	Task 8	\N	done	urgent	2026-10-09	46	user-1	2026-10-11 00:02:42.941602+05:30	2026-10-11 00:02:42.941602+05:30
67	Task 9	\N	todo	high	2026-10-13	47	user-1	2026-10-11 00:02:42.962219+05:30	2026-10-11 00:02:42.962219+05:30
68	Task 10	\N	done	low	2026-10-13	47	user-1	2026-10-11 00:02:42.982847+05:30	2026-10-11 00:02:42.982847+05:30
70	Build Test Feature	Task creation test	todo	high	\N	1	user-1	2026-10-11 00:02:43.436502+05:30	2026-10-11 00:02:43.436502+05:30
71	Kanban Drag Task	\N	in-progress	urgent	\N	1	user-1	2026-10-11 00:02:43.515565+05:30	2026-10-11 00:02:43.572998+05:30
\.


--
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspaces (id, name, description, icon, color, owner_id, created_at, updated_at) FROM stdin;
1	Pincher Development	AI-powered fashion recommendation platform workspace	🚀	#6366f1	user-1	2026-10-10 22:57:17.458331+05:30	2026-10-10 22:57:17.458331+05:30
2	College Projects	Semester projects and assignments for CS department	🎓	#8b5cf6	user-1	2026-10-10 22:57:17.458331+05:30	2026-10-10 22:57:17.458331+05:30
3	Personal Projects	Side projects and experiments	💡	#06b6d4	user-1	2026-10-10 22:57:17.458331+05:30	2026-10-10 22:57:17.458331+05:30
4	Open Source	Open source contributions and community projects	🌐	#10b981	user-1	2026-10-10 22:57:17.458331+05:30	2026-10-10 22:57:17.458331+05:30
5	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 22:57:17.672521+05:30	2026-10-10 22:57:17.672521+05:30
7	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 22:57:43.971507+05:30	2026-10-10 22:57:43.971507+05:30
9	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 22:59:04.746493+05:30	2026-10-10 22:59:04.746493+05:30
11	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:11:00.191285+05:30	2026-10-10 23:11:00.191285+05:30
13	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:13:09.652151+05:30	2026-10-10 23:13:09.652151+05:30
15	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:18:15.603106+05:30	2026-10-10 23:18:15.603106+05:30
17	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:20:32.885215+05:30	2026-10-10 23:20:32.885215+05:30
19	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:44:37.009677+05:30	2026-10-10 23:44:37.009677+05:30
21	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:46:58.397319+05:30	2026-10-10 23:46:58.397319+05:30
23	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:51:08.388908+05:30	2026-10-10 23:51:08.388908+05:30
25	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:53:59.850558+05:30	2026-10-10 23:53:59.850558+05:30
27	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:54:52.995985+05:30	2026-10-10 23:54:52.995985+05:30
29	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-10 23:58:38.919237+05:30	2026-10-10 23:58:38.919237+05:30
31	QA Workspace Alpha	Primary QA WS	🚀	#6366f1	user-1	2026-10-11 00:00:00.777057+05:30	2026-10-11 00:00:00.777057+05:30
32	QA Workspace Beta	Secondary QA WS	🚀	#6366f1	user-1	2026-10-11 00:00:00.812703+05:30	2026-10-11 00:00:00.812703+05:30
34	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-11 00:00:02.152276+05:30	2026-10-11 00:00:02.152276+05:30
36	QA Workspace Alpha	Primary QA WS	🚀	#6366f1	user-1	2026-10-11 00:02:42.641064+05:30	2026-10-11 00:02:42.641064+05:30
37	QA Workspace Beta	Secondary QA WS	🚀	#6366f1	user-1	2026-10-11 00:02:42.665948+05:30	2026-10-11 00:02:42.665948+05:30
39	Test Engineering Workspace	Integration test workspace description	⚡	#6366f1	user-1	2026-10-11 00:02:43.823375+05:30	2026-10-11 00:02:43.823375+05:30
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 92, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 10, true);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_id_seq', 10, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 48, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 73, true);


--
-- Name: workspaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workspaces_id_seq', 40, true);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: ix_activities_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_activities_id ON public.activities USING btree (id);


--
-- Name: ix_activities_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_activities_type ON public.activities USING btree (type);


--
-- Name: ix_activities_workspace_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_activities_workspace_id ON public.activities USING btree (workspace_id);


--
-- Name: ix_comments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_comments_id ON public.comments USING btree (id);


--
-- Name: ix_comments_task_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_comments_task_id ON public.comments USING btree (task_id);


--
-- Name: ix_members_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_members_email ON public.members USING btree (email);


--
-- Name: ix_members_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_members_id ON public.members USING btree (id);


--
-- Name: ix_members_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_members_user_id ON public.members USING btree (user_id);


--
-- Name: ix_members_workspace_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_members_workspace_id ON public.members USING btree (workspace_id);


--
-- Name: ix_projects_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_projects_id ON public.projects USING btree (id);


--
-- Name: ix_projects_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_projects_name ON public.projects USING btree (name);


--
-- Name: ix_projects_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_projects_status ON public.projects USING btree (status);


--
-- Name: ix_projects_workspace_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_projects_workspace_id ON public.projects USING btree (workspace_id);


--
-- Name: ix_tasks_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tasks_id ON public.tasks USING btree (id);


--
-- Name: ix_tasks_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tasks_priority ON public.tasks USING btree (priority);


--
-- Name: ix_tasks_project_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tasks_project_id ON public.tasks USING btree (project_id);


--
-- Name: ix_tasks_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tasks_status ON public.tasks USING btree (status);


--
-- Name: ix_tasks_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tasks_title ON public.tasks USING btree (title);


--
-- Name: ix_workspaces_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_workspaces_id ON public.workspaces USING btree (id);


--
-- Name: ix_workspaces_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_workspaces_name ON public.workspaces USING btree (name);


--
-- Name: activities activities_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: comments comments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: members members_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: projects projects_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6gcz91Tew5vz2IwTFj1m5PAKhSoupgHM52bApWI4JAw2JRIwiPvLIXOjim5QXSj

