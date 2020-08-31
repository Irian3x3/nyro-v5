CREATE TABLE public.guild (
	id text PRIMARY NOT NULL,
	"data" text NULL
);

CREATE TABLE public.tags (
	guild text NULL,
	author text NULL,
	content TEXT NULL,
	createdat date NULL DEFAULT now(),
	uses int NULL DEFAULT 0,
	name text NULL,
	editedat date NULL DEFAULT now(),
	editedby text NULL
);

CREATE TABLE public.economy (
	"user" text PRIMARY NULL,
	guild text NULL,
	wallet int NULL DEFAULT 0,
	bank int NULL DEFAULT 0
);

CREATE TABLE public.moderation (
	guild text NULL,
	"user" text NULL,
	moderator text NULL,
	"case" int NULL,
	"type" text NULL,
	duration int NULL,
	reason text NULL,
	"date" date NULL DEFAULT now()
);
