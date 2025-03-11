"use client";
import Card from "./AboutCard";

export default function About() {
    return (
        <section className="w-full h-full overflow-y-auto bg-white">
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-3xl font-bold mb-4">About Us</h1>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-8 p-4">
                <Card />
                <Card />
                <Card /> 
                <Card /> 
                <Card />

            </div>
        </section>
    );
}
